from django.urls import path, include
from rest_framework.authtoken import views as drf_views
from rest_framework.routers import DefaultRouter

from .views import AuthViewSet, UserLookup

router = DefaultRouter()
router.register('', AuthViewSet, basename='auth')

urlpatterns = [
    path('user-search/', UserLookup.as_view()),
    path('token/auth/', drf_views.obtain_auth_token),
    path('', include(router.urls)),
]

"""
users urls/views/serializers in use:
.../api/

    NEW                       OLD                         VIEW                SERIALIZER
    /user-search/<search>/    /user-search/<search>/      : UserLookup        : UserLookupSerializer
    /login/                   /auth2/login/               : AuthViewSet       : UserLoginSerializer
    /logout/                  /auth2/logout/              : AuthViewSet       : EmptySerializer
    /register/                /auth2/register/            : AuthViewSet       : UserRegisterSerializer
    /basic_user_details/      /auth2/basic_user_details/  : AuthViewSet       : BasicUserDetails
"""
