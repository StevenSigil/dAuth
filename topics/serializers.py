from boards.serializers import BaseBoardSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

from user_profile.models import BaseUserProfile
from user_profile.serializers import UserCardSerializer

from .models import Topic


class BaseTopicSerializer(serializers.ModelSerializer):
    """
    Retrieve's the Board's (details) associated with Topic.
    """
    channel = BaseBoardSerializer(many=True, read_only=True)
    created_by = serializers.SlugRelatedField(many=False, read_only=True, slug_field='username')
    topic_admins = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')

    class Meta:
        model = Topic
        fields = ['id', 'name', 'description', 'created_by', 'channel', 'topic_admins']
        read_only_fields = ['id', 'date_time_created', 'channel']


class PublicTopicsSerializer(serializers.ModelSerializer):
    users_subscribed_count = serializers.SerializerMethodField()
    boards = serializers.SerializerMethodField()
    created_by = serializers.SlugRelatedField('username', read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'date_time_created', 'description', 'created_by', 'users_subscribed_count', 'boards']

    def get_users_subscribed_count(self, obj):
        return obj.user_profile.count()

    def get_boards(self, obj):
        return obj.channel.values()


# ========================================================================================================= #
# ======================================== Topic Subscription View ======================================== #
class EmptySerializer(serializers.Serializer):
    pass


class NewTopicSubscription(serializers.Serializer):
    id = serializers.UUIDField(required=True)  # Topic instance UUID


class TopicAdminSerializer(serializers.ModelSerializer):
    userID = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(),
                                                many=True,
                                                source='topic_admins')
    id = serializers.UUIDField()

    class Meta:
        model = Topic
        fields = ('id', 'userID')


class SubscribedToTopics(serializers.ModelSerializer):
    users_on_topic = UserCardSerializer(many=True, read_only=True, source='user_profile')

    class Meta:
        model = Topic
        fields = ('users_on_topic',)


class CondensedTopicSerializer(serializers.ModelSerializer):
    created_by = serializers.SlugRelatedField('username', read_only=True)

    class Meta:
        model = Topic
        fields = ('id', 'name', 'created_by', 'description', 'created_by', 'date_time_created', 'topic_admins')


# ========================================================================================================= #
# ========================================================================================================= #


class SingleTopicWithBoardsUsersSerializer(serializers.ModelSerializer):
    users_subscribed = UserCardSerializer(many=True, read_only=True, source='user_profile')
    created_by = serializers.SlugRelatedField('username', read_only=True)
    topic_admins = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ('id', 'date_time_created', 'name', 'description', 'created_by', 'created_by', 'topic_admins',
                  'users_subscribed',)

    def get_topic_admins(self, obj):
        topic_admin_cards = []
        admin_ids = obj.topic_admins.values('id')
        for admin in admin_ids:
            profile = BaseUserProfile.objects.get(user=admin['id'])
            card_serializer = UserCardSerializer(profile, context=self.context, read_only=True)
            topic_admin_cards.append(card_serializer.data)
        return topic_admin_cards


class CondensedBoardsFromTopicSerializer(serializers.ModelSerializer):
    boards = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ('boards',)

    def get_boards(self, obj):
        boards = obj.channel.values()
        custom_boards = []
        for board in boards:
            board_id = board['id']
            name = board['board_name']
            description = board['board_description']
            x = {
                'id': board_id,
                'board_name': name,
                'board_description': description
            }
            custom_boards.append(x)
        return custom_boards
