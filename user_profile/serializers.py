from topics.models import Topic
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import BaseUserProfile


class ProfileAndUserDetailsSerializer(serializers.ModelSerializer):
    """
    Allows for retrieving and updating the defined fields.
    NOTE: 'id' & 'username' are of CustomUser and can't be updated here.
    """
    id = serializers.PrimaryKeyRelatedField(read_only=True, source='user')
    username = serializers.SlugRelatedField('username', source='user', read_only=True)

    class Meta:
        model = BaseUserProfile
        fields = ('id', 'display_name', 'username', 'bio', 'instagram_handle', 'twitter_handle', 'image')


class UserCardSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = BaseUserProfile
        fields = ['user_id', 'username', 'display_name', 'image']

    def get_username(self, profile):
        user = get_user_model().objects.get(user_profile=profile)
        return user.username

    def get_image(self, profile):
        request = self.context.get('request')
        photo_url = profile.image.url
        return request.build_absolute_uri(photo_url)


class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUserProfile
        fields = ['image']


# --------------------------------------------------------------------------------------------------- #
# ------------------------------------ ProfileForPublicProfileView ---------------------------------- #
class EmptySerializer(serializers.Serializer):
    pass


class OtherUsersPublicProfileSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = BaseUserProfile
        fields = ('user_details', 'friends',)

    def get_user_details(self, obj):
        profile = BaseUserProfile.objects.get(user=obj)
        custom_fields = {
            'user_id': profile.user.id,
            'username': profile.user.username,
            'display_name': profile.display_name,
            'bio': profile.bio,
            'instagram_handle': profile.instagram_handle,
            'twitter_handle': profile.twitter_handle,
        }
        return custom_fields

    def get_friends(self, obj):
        friends = obj.user_profile.friends.values_list('id', flat=True)
        x = []
        for friend in friends:
            details = self.get_user_details(friend)
            x.append(details)
        return x


class AddFriendSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)


class UserFriendObjectSerializer(serializers.Serializer):
    friends = serializers.SerializerMethodField()

    def get_friends(self, users_profile):
        friends_profiles = []
        try:
            friends_id_list = users_profile.friends.values_list('user_profile', flat=True)
            for pk in friends_id_list:
                friend_profile = BaseUserProfile.objects.get(id=pk)
                friends_profiles.append(friend_profile)
        except AttributeError:
            friends_profiles = [None]
            return friends_profiles
        else:
            return friends_profiles


class SubscribedToTopics(serializers.ModelSerializer):
    """
    Dependency for ProfileAndSubscribedToTopicsSerializer (below)
    """
    created_by = serializers.SlugRelatedField('username', read_only=True)

    class Meta:
        model = Topic
        fields = ('id', 'name', 'created_by', 'description', 'date_time_created')
        read_only_fields = ('id', 'date_time_created',)


class ProfileAndSubscribedToTopicsSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False, read_only=True)
    topics_subscribed_to = SubscribedToTopics(many=True, read_only=True)

    class Meta:
        model = BaseUserProfile
        fields = ('id', 'user', 'display_name', 'bio', 'topics_subscribed_to', 'instagram_handle', 'twitter_handle')
        read_only_fields = ('id', 'topics_subscribed_to', 'display_name', 'bio', 'instagram_handle', 'twitter_handle')


class UserProfileDetailsSerializer(serializers.Serializer):
    user_details = serializers.SerializerMethodField()

    def get_user_details(self, obj):
        profile = BaseUserProfile.objects.get(user=obj)
        custom_fields = dict()
        custom_fields['bio'] = profile.bio
        custom_fields['instagram_handle'] = profile.instagram_handle
        custom_fields['twitter_handle'] = profile.twitter_handle
        return custom_fields

# --------------------------------------------------------------------------------------------------- #
# --------------------------------------------------------------------------------------------------- #
