from django.urls import include, re_path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('public', views.PublicTopicsView, basename='public-topics')
router.register('subscriptions', views.TopicSubscriptionsView, basename='subscriptions')
router.register('SingleTopicBoardsUsersView', views.SingleTopicBoardsUsersView, basename='SingleTopicBoardsUsersView')
router.register('', views.TopicTest, basename=r'topic')

urlpatterns = [
    re_path('boards-condensed/(?P<id>[^/.]+)/$', views.CondensedBoardsFromTopicView.as_view(), name='topic_condensed_boards'),
    re_path('', include(router.urls)),
]

"""
topics urls/views/serializers in use:
.../api/topics

    NEW                                    OLD                                     VIEW                            SERIALIZER
    /                                      /t/t                                    : TopicTest                     : BaseTopicSerializer
    /public/                               /t/public/                              : PublicTopicsView              : PublicTopicsSerializer        
    /subscriptions/new_subscriber/         /t/subcriptions/new_subscriber/         : TopicSubscriptionsView        : NewTopicSubscription, EmptySerializer
    /subscriptions/remove_subscription/    /t/subcriptions/remove_subscription/    : TopicSubscriptionsView        : NewTopicSubscription
    /subscriptions/add_topic_admins/       /t/subcriptions/add_topic_admins/       : TopicSubscriptionsView        : TopicAdminSerializer
    /subscriptions/other_users_on_topic/   /t/subcriptions/other_users_on_topic/   : TopicSubscriptionsView        : SubscribedToTopics
    /subscriptions/condensed_topics/       /t/subcriptions/condensed_topics/       : TopicSubscriptionsView        : CondensedTopicSerializer
    /SingleTopicBoardsUsersView/           /t/SingleTopicBoardsUsersView/          : SingleTopicBoardsUsersView    : SingleTopicWithBoardsUsersSerializer
    /boards-condensed/                     /boards-condensed/                      : CondensedBoardsFromTopicView  : CondensedBoardsFromTopicSerializer
"""
