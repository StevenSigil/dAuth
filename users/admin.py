from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user_profile.models import BaseUserProfile

from .models import CustomUser


class BaseUserProfileInline(admin.StackedInline):
    model = BaseUserProfile
    can_delete = False
    verbose_name = 'profile'


class UserAdmin(BaseUserAdmin):
    inlines = [BaseUserProfileInline]


admin.site.register(CustomUser, UserAdmin)
