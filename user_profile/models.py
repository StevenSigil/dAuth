import os
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from topics.models import Topic


class BaseUserProfile(models.Model):
    id = models.UUIDField(primary_key=True, auto_created=True, default=uuid.uuid4)
    user = models.OneToOneField(to=get_user_model(), on_delete=models.CASCADE, related_name='user_profile')
    bio = models.CharField(max_length=150, default=' ')
    topics_subscribed_to = models.ManyToManyField(Topic, related_name='user_profile')
    friends = models.ManyToManyField(get_user_model(), related_name='user_profile_friends')
    instagram_handle = models.CharField(max_length=100, blank=True)
    twitter_handle = models.CharField(max_length=100, blank=True)
    display_name = models.CharField(max_length=25, unique=False, null=False, blank=False, default="DisplayNameNotSet")
    image = models.ImageField(upload_to='profile', default='default_profile_img.png')

    def __str__(self):
        return self.user.username + "'s Profile"

    def save(self, *args, **kwargs):
        self.clean()

    def clean(self, *args, **kwargs):
        # Removes spaces from display_name in case the front-end doesn't catch it.
        if self.display_name:
            self.display_name = self.display_name.replace(" ", "")

        # Deletes the former profile picture then saves the new one.
        try:
            profile = BaseUserProfile.objects.get(id=self.id)
            if profile.image != self.image and prof.image.name != 'default_profile_img.png':
                profile.image.delete(save=False)
        except:
            pass
        super(BaseUserProfile, self).save(*args, **kwargs)
