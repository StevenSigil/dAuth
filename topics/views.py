from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from rest_framework import permissions, viewsets, generics, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from user_profile.models import BaseUserProfile

from . import serializers
from .models import Topic


class TopicTest(viewsets.ModelViewSet):
    """
    Class for the user to Create a new topic and assign it to their profile's 'subscriptions'.
    """
    queryset = Topic.objects.all()
    serializer_class = serializers.BaseTopicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Creates a new Topic instance & assigns the submitting user as 'created_by' & 'topic_admin'
        """
        submitting_user = self.request.user
        new_topic = serializer.save(created_by=submitting_user)
        new_topic.topic_admins.add(submitting_user)
        new_topic.save()
        data = dict(serializer.data)
        profile = BaseUserProfile.objects.get(user=submitting_user)
        profile.topics_subscribed_to.add(data['id'])


class PublicTopicsView(viewsets.ModelViewSet):
    serializer_class = serializers.PublicTopicsSerializer
    queryset = Topic.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'channel__board_name']


class TopicSubscriptionsView(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Topic.objects.all()
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'new_subscriber': serializers.NewTopicSubscription,
        'remove_subscription': serializers.NewTopicSubscription,
        'add_topic_admins': serializers.TopicAdminSerializer,
        'other_users_on_topic': serializers.SubscribedToTopics,
        'condensed_topics': serializers.CondensedTopicSerializer
    }

    @action(methods=['POST', ], detail=False)
    def new_subscriber(self, request):
        """
        Adds a Topic instance to a user's profile (subscribe)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            topic_query = Topic.objects.get(id=serializer.data['id'])
        except Topic.DoesNotExist:
            return Response("The Topic ID provided is invalid.", status=status.HTTP_400_BAD_REQUEST)
        else:
            profile = BaseUserProfile.objects.get(user=request.user)
            profile.topics_subscribed_to.add(topic_query)
            return Response(profile.topics_subscribed_to.values(), status=status.HTTP_200_OK)

    @action(methods=['POST', ], detail=False)
    def remove_subscription(self, request):
        """
        Removes a Topic instance from a user's profile (unsubscribe)
        """
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            topic_query = Topic.objects.get(id=serializer.data['id'])
        except Topic.DoesNotExist:
            return Response("The Topic ID provided is invalid.", status=status.HTTP_400_BAD_REQUEST)
        else:
            profile = BaseUserProfile.objects.get(user=user)
            profile.topics_subscribed_to.remove(topic_query)
            if topic_query.topic_admins.filter(id=user.id).exists():
                topic_query.topic_admins.remove(user)
            return Response(profile.topics_subscribed_to.values(), status=status.HTTP_200_OK)

    @action(methods=['POST', 'GET', ], detail=False)
    def add_topic_admins(self, request, *args, **kwargs):
        if request.method == 'GET':
            serializer = self.get_serializer(self.get_queryset(), many=True, *args, **kwargs)
            return Response(serializer.data, status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data, *args, **kwargs)
            serializer.is_valid(raise_exception=True)
            adding_user = get_user_model().objects.get(id=serializer.data['userID'][0])
            topic = Topic.objects.get(id=serializer.data.pop('id'))
            topic.topic_admins.add(adding_user)
            adding_user.user_profile.topics_subscribed_to.add(topic)
            return Response('User has been added.', status=status.HTTP_202_ACCEPTED)

    @action(methods=['POST', ], detail=False)
    def other_users_on_topic(self, request, *args, **kwargs):
        """
        Retrieves the users subscribed to a specific topic. Assumes data is {'id': topic.id}
        """
        data = request.data['id']
        query = Topic.objects.get(id=data)
        serializer = self.get_serializer(query, *args, **kwargs)
        return Response(serializer.data)

    @action(methods=['GET', 'POST'], detail=False)
    def condensed_topics(self, request):
        """
        Returns only the topics that the user is subscribed to.
        User is inferred from GET req. or defined by a POST req as {'id':'userid'}
        """
        if request.method == 'POST':
            user_id = request.data['id']
            user = get_user_model().objects.get(id=user_id)
        else:
            user = request.user
        profile = BaseUserProfile.objects.get(user=user)
        query = profile.topics_subscribed_to
        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")
        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()


class SingleTopicBoardsUsersView(viewsets.ModelViewSet):
    """
    Retrieves the details needed for PublicTopicDetails & EditTopic pages.
    Assumes using a retrieve lookup for single Topic instances (ie: <code>../(toipcID)/</code>).
    """
    queryset = Topic.objects.all()
    serializer_class = serializers.SingleTopicWithBoardsUsersSerializer

    def list(self, request, *args, **kwargs):
        serializer = serializers.SingleTopicWithBoardsUsersSerializer(self.get_queryset(), context={'request': request}, many=True)
        return Response(serializer.data)


class CondensedBoardsFromTopicView(generics.RetrieveUpdateAPIView):
    """
    Retrieves a condensed version of board objects set on a topic instance.
    Used for frontend cards.
    """
    queryset = Topic.objects.all()
    serializer_class = serializers.CondensedBoardsFromTopicSerializer
    lookup_field = 'id'
