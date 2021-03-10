from topics.models import Topic
from django.contrib.auth import get_user_model, logout, login
from django.core.exceptions import ImproperlyConfigured
from rest_framework import permissions
from rest_framework import viewsets, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from user_profile.models import BaseUserProfile

from . import serializers
from .utils import get_and_authenticate_user, create_user_account


class UserLookup(generics.ListAPIView):
    """
    View to search for other users by 'username' or 'display_name'
    Returns the same format as UserCardSerializer from 'user_profiles'
    """
    queryset = get_user_model().objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserLookupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'user_profile__display_name']


# ---------------------------------------------------------------------------------------------------------- #
# ------------------------------------------- AuthViewSet -------------------------------------------------- #
class AuthViewSet(viewsets.GenericViewSet):
    User = get_user_model()
    permission_classes = [permissions.AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'login': serializers.UserLoginSerializer,
        'register': serializers.UserRegisterSerializer,
        'password_change': serializers.PasswordChangeSerializer,
        'basic_user_details': serializers.BasicUserDetails,
    }

    @action(methods=['POST', ], detail=False, permission_classes=[permissions.AllowAny, ])
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)
        login(request, user)
        data = serializers.AuthUserSerializer(user).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['POST', ], detail=False)
    def register(self, request):
        # display_name = request.data.pop('display_name')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        display_name = serializer.validated_data.pop('display_name')
        user = create_user_account(**serializer.validated_data)
        BaseUserProfile.objects.get_or_create(user=user, display_name=display_name)
        profile = BaseUserProfile.objects.get(user=user)
        # default_topic = Topic.objects.get(id='f82a351d-dd8f-4298-8a34-047e70ef2e20')
        default_topic = Topic.objects.get(name="Testing-&-T")
        profile.topics_subscribed_to.add(default_topic)
        profile.save()
        data = serializers.AuthUserSerializer(user).data
        return Response(data=data, status=status.HTTP_201_CREATED)

    @action(methods=['POST', ], detail=False)
    def logout(self, request):
        """
        Logout view - passes no data to a serializer (EmptySerializer will be used)
        """
        logout(request)
        data = {'success': 'Successfully logged out.'}
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['POST', ], detail=False, permission_classes=[permissions.IsAuthenticated, ])
    def password_change(self, request):
        # TODO: Not implemented on front end. Need to fix that!
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['GET', 'PATCH', ], detail=False, permission_classes=[permissions.IsAuthenticated])
    def basic_user_details(self, request):
        if request.method == 'PATCH':
            serializer = self.get_serializer(data=request.data, instance=request.user)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        elif request.method == 'GET':
            serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")
        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()
