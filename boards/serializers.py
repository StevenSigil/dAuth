from rest_framework import serializers

from .models import Board, Post
from topics.models import Topic
from user_profile.serializers import UserCardSerializer


class BoardSerializerFromTopicsNoPosts(serializers.ModelSerializer):
    assoc_channel = serializers.PrimaryKeyRelatedField(queryset=Topic.objects.all())

    class Meta:
        model = Board
        fields = ['id', 'created_by', 'date_created', 'board_name', 'board_description', 'assoc_channel']
        read_only_fields = ['id', 'date_created', 'created_by']


class PostSerializer(serializers.ModelSerializer):
    visible = serializers.BooleanField(initial=True, required=False)
    posting_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['message', 'visible', 'posting_user', 'id', 'date_time_created']
        read_only_fields = ['posting_user', 'id']

    def get_posting_user(self, obj):
        profile = obj.posting_user.user_profile
        card_serializer = UserCardSerializer(profile, context=self.context).data
        return card_serializer


class BaseBoardSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = '__all__'
        read_only_fields = ['id', 'date_created', 'created_by', 'posts']


class PostSerializer2(serializers.ModelSerializer):
    posting_user = serializers.SlugRelatedField(many=False, read_only=True, slug_field='username')

    class Meta:
        model = Post
        fields = ['id', 'message', 'visible', 'posting_user', 'date_time_created', 'board']
        read_only_fields = ['id', 'posting_user', 'date_time_created']
