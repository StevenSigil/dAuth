"""backend URL Configuration
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, re_path, include
from django.conf.urls.static import static

from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/users/', include('users.urls')),
    path('api/profiles/', include('user_profile.urls')),
    path('api/topics/', include('topics.urls')),
    path('api/boards/', include('boards.urls')),

    # Frontend build
    path('', index, name='index'),
    re_path('(?P<pk>[^/.]+)/$', index, name='index'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
