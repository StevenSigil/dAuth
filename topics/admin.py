from django.contrib import admin

from .models import Topic


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_by', 'date_time_created', 'name', 'description', 'is_private']
