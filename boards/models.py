import uuid
from django.db import models
from django.contrib.auth import get_user_model


class Board(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assoc_channel = models.ForeignKey('topics.Topic', related_name='channel', on_delete=models.CASCADE)
    created_by = models.ForeignKey(get_user_model(), related_name='boards_owner', on_delete=models.CASCADE)
    date_created = models.DateField(auto_now=True)
    board_name = models.CharField(max_length=25)
    board_description = models.CharField(max_length=100, verbose_name='Board descriptions')
    posts = models.ManyToManyField('Post', related_name='board')

    def __str__(self):
        return self.board_name


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_time_created = models.DateTimeField(auto_now=True, null=False)
    message = models.CharField(max_length=350)
    posting_user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='posting_user')
    visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['date_time_created']

    def __str__(self):
        return message, posting_user
