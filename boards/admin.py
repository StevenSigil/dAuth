from django.contrib import admin
from .models import Board, Post


class PostAdmin(admin.ModelAdmin):
    model = Post
    readonly_fields = ['id', 'date_time_created']


class BoardAdmin(admin.ModelAdmin):
    list_display = ['board_name', 'assoc_channel', 'board_description', 'created_by', 'id']


admin.site.register(Board, BoardAdmin)
admin.site.register(Post, PostAdmin)
