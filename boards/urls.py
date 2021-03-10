from django.urls import path, include, re_path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('posts2', views.PostViewset2, basename='posts2')
router.register('', views.BoardViewSet, basename='boards')

urlpatterns = [
    re_path('update/(?P<pk>[^/.]+)/$', views.BoardPatchView.as_view(), name='Updateboard'),
    re_path('retrieve-boards/(?P<pk>[^/.]+)/$', views.BoardWithPostsView.as_view(), name='Retrieve_board_and_posts'),  # Do we need this?
    path('', include(router.urls), name='Board'),
]

"""
Boards urls/views/serializers in use: 
.../api/board/
    
    NEW                 OLD                 VIEW                  SERIALIZER
    /                   b/b/                : BoardViewSet        : BoardSerializerFromTopicsNoPosts
    /new_board/         b/b/new_board/      : BoardViewSet        : BoardSerializerFromTopicsNoPosts
    posts2/             b/posts2/           : PostViewset2        : PostSerializer2
    update/             update/             : BoardPatchView      : BaseBoardSerializer
    retrieve-boards/    retrieve-boards/    : BoardWithPostsView  : BaseBoardSerializer
"""
