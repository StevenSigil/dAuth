from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from rest_framework import permissions, viewsets, status, views
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import BaseUserProfile
from . import serializers


class UpdateBioView(viewsets.ModelViewSet):
    """
    Update the bio for the user.
    """
    serializer_class = serializers.ProfileAndUserDetailsSerializer
    queryset = BaseUserProfile.objects.all()
    lookup_field = 'user'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class UserCards(viewsets.ModelViewSet):
    """
    Infrequently used view that returns a user instance formatted in 'card' format for frontend.
    """
    serializer_class = serializers.UserCardSerializer
    queryset = BaseUserProfile.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'user'


class ProfileForPublicProfileView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = BaseUserProfile.objects.all()
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'add_friend': serializers.AddFriendSerializer,
        'remove_friend': serializers.AddFriendSerializer,
        'users_friends': serializers.UserFriendObjectSerializer,
        'profile_topics': serializers.ProfileAndSubscribedToTopicsSerializer,
        'other_user_public_profile': serializers.OtherUsersPublicProfileSerializer,
    }

    @action(methods=['GET', 'POST', ], detail=False)
    def add_friend(self, request):
        if request.method == 'GET':
            serializer = serializers.OtherUsersPublicProfileSerializer(instance=request.user)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            try:
                friend_query = get_user_model().objects.get(id=serializer.data['id'])
            except BaseUserProfile.DoesNotExist:
                return Response("The UserID is invalid.", status=status.HTTP_400_BAD_REQUEST)
            else:
                requesting_users_profile = BaseUserProfile.objects.get(user=request.user)
                friend_query_profile = BaseUserProfile.objects.get(user=friend_query)
                requesting_users_profile.friends.add(friend_query)
                friend_query_profile.friends.add(request.user)
                return_serializer = serializers.OtherUsersPublicProfileSerializer(instance=request.user)
                return Response(return_serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET', 'POST', ], detail=False)
    def remove_friend(self, request):
        if request.method == 'GET':
            serializer = serializers.OtherUsersPublicProfileSerializer(instance=request.user)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            try:
                friend_query = get_user_model().objects.get(id=serializer.data['id'])
            except BaseUserProfile.DoesNotExist:
                return Response("The UserID is invalid.", status=status.HTTP_400_BAD_REQUEST)
            else:
                requesting_users_profile = BaseUserProfile.objects.get(user=request.user)
                friend_query_profile = BaseUserProfile.objects.get(user=friend_query)
                requesting_users_profile.friends.remove(friend_query)
                friend_query_profile.friends.remove(request.user)
                return_serializer = serializers.OtherUsersPublicProfileSerializer(instance=request.user)
                return Response(return_serializer.data, status=status.HTTP_200_OK)
        return Response("Something didn't work right.", status.HTTP_304_NOT_MODIFIED)

    @action(methods=['GET', ], detail=False)
    def users_friends(self, request):
        profile = request.user.user_profile
        friend_serializer = self.get_serializer(profile)
        card_serializer = serializers.UserCardSerializer(friend_serializer.data['friends'], context={'request': request}, many=True)
        return Response(card_serializer.data)

    @action(methods=['GET', 'POST'], detail=False)
    def profile_topics(self, request):
        """
        Returns the user's profiles and the 'topics_subscribed_to' (serializer)
        """
        if request.method == 'POST':
            user_id = request.data['id']
            user = get_user_model().objects.get(id=user_id)
        else:
            user = request.user
        profile = user.user_profile
        serializer = self.get_serializer(profile)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET', 'POST'], detail=False)
    def other_user_public_profile(self, request):
        """
        Returns the current users details and their friends details in the 'card' format for the frontend.
        """
        if request.method == 'POST':
            user_id = request.data['id']
            user = get_user_model().objects.get(id=user_id)
        else:
            user = request.user
        users_primary_serializer = serializers.UserCardSerializer(user.user_profile, context={'request': request})
        user_details_serializer = serializers.UserProfileDetailsSerializer(user)
        friend_serializer = serializers.UserFriendObjectSerializer(user.user_profile)
        friends_cards = serializers.UserCardSerializer(friend_serializer.data['friends'], context={'request': request}, many=True)
        users_data = dict()
        users_data.update(users_primary_serializer.data)
        users_data.update(user_details_serializer.data['user_details'])
        users_data['friends'] = friends_cards.data
        return Response(users_data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")
        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()


class ImageUploadView(views.APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_profile = request.user.user_profile
        serializer = serializers.ProfileImageSerializer(data=request.data, instance=user_profile, *args, **kwargs)
        if serializer.is_valid(raise_exception=True):
            serializer.save(*args, **kwargs)
            response_serialzer = serializers.ProfileAndUserDetailsSerializer(instance=user_profile)
            return Response(response_serialzer.data, status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response(BaseUserProfile.objects.all().values())
