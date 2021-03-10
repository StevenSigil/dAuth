from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers


def get_and_authenticate_user(email, password):
    """
    Authenticates a user's login attempt with their email & password instance.
    """
    user_instance = get_user_model().objects.get(email=email)
    user = authenticate(username=user_instance, password=password)
    if user is None:
        raise serializers.ValidationError("Invalid username/password. Please try again")
    return user


def create_user_account(email, password, first_name="", last_name="", **extra_fields):
    user = get_user_model().objects.create_user(email=email, password=password, first_name=first_name,
                                                last_name=last_name, **extra_fields)
    return user
