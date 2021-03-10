from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.authtoken.models import Token

User = get_user_model()


class UserLookupSerializer(serializers.ModelSerializer):
    """
    Allows a user to search for another user by display_name/username.
    Returns in the same format as UserCardSerializer for easier use in frontend UserCards.
    """
    user_id = serializers.UUIDField(source='id')
    display_name = serializers.SlugRelatedField('display_name', read_only=True, source='user_profile')
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['user_id', 'username', 'display_name', 'image', ]

    def get_image(self, user):
        request = self.context.get('request')
        try:
            profile = user.user_profile
        except ObjectDoesNotExist:
            return None
        else:
            photo_url = profile.image.url
            return request.build_absolute_uri(photo_url)


# ---------------------------------------------------------------------------------------------------------- #
# ------------------------------------------- AuthViewSet -------------------------------------------------- #
class EmptySerializer(serializers.Serializer):
    pass


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=300, required=True)
    password = serializers.CharField(required=True, write_only=True)


class AuthUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'auth_token')
        read_only_fields = ('id', 'is_active', 'is_staff')

    def get_auth_token(self, obj):
        token, _ = Token.objects.get_or_create(user=obj)
        return token.key


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    A user serializer for registering the user.
    """
    display_name = serializers.CharField(default="DisplayNameNotSet")

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'display_name')
    
    def validate_display_name(self, value):
        if " " in value:
            value = value.join(" ")
        return value

    def validate_email(self, value):
        user = User.objects.filter(email=value)
        if user:
            raise serializers.ValidationError("Email is already registered")
        return BaseUserManager.normalize_email(value)

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Current password does not match')
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value


class BasicUserDetails(serializers.ModelSerializer):
    """
    Returns or updates the basic user details after logging in to begin retrieving data on post-login load.
    """
    pk = serializers.UUIDField(read_only=True)
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['pk', 'email', 'username']
