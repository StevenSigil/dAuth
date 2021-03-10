from django.urls import include, re_path, path
from rest_framework.routers import DefaultRouter

from .views import UpdateBioView, ProfileForPublicProfileView, UserCards, ImageUploadView

router = DefaultRouter()
router.register('bio', UpdateBioView, basename='update-bio')
router.register('public', ProfileForPublicProfileView, basename='profile_for_public_profile_view')
router.register('usercards', UserCards, basename='user_cards')

urlpatterns = [
    path('image/', ImageUploadView.as_view(), name='profile_image_upload'),
    path('', include(router.urls), name='user_profile'),
]

"""
user_profile urls/views/serializers in use:
.../api/profiles

    NEW                                 OLD                                     VIEW                            SERIALIZER
    /bio/                               /i/u/bio/                               : UpdateBioView                 : ProfileAndUserDetailsSerializer
    /usercards/                         /i/usercards/                           : UserCards                     : UserCardSerializer
    /public/add_friend/                 /i/public/add_friend/                   : ProfileForPublicProfileView   : AddFriendSerializer
    /public/remove_friend/              /i/public/remove_friend/                : ProfileForPublicProfileView   : AddFriendSerializer
    /public/users_friends/              /i/public/users_friends/                : ProfileForPublicProfileView   : UserFriendObjectSerializer
    /public/profile_topics/             /i/public/profile_topics/               : ProfileForPublicProfileView   : ProfileAndSubscribedToTopicsSerializer
    /public/other_user_public_profile/  /i/public/other_user_public_profile/    : ProfileForPublicProfileView   : UserProfileDetailsSerializer
                                                                                : OtherUsersPublicProfileSerializer        
    /image/                             /image/                                 : ImageUploadView               : ProfileImageSerializer
"""
