import uuid
from django.db import models
from django.contrib.auth import get_user_model


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic_admins = models.ManyToManyField('users.CustomUser', related_name='topic_admins')
    date_time_created = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=35, verbose_name='Topic Name')
    description = models.CharField(max_length=100, verbose_name='Topic Description')
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(get_user_model(), related_name='topic_owner', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
