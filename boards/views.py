from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin

from . import serializers 
from .models import Board, Post


class BoardViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializerFromTopicsNoPosts

    @action(methods=['POST', 'GET'], detail=False)
    def new_board(self, request):
        """
        Creates a new Board instance.
        Serializer expects fields: ('board_name', 'board_description', 'assoc_channel')
        """
        serializer = self.get_serializer(data=request.data)
        user = get_user_model().objects.get(username=request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by_id=user.id)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PostViewset2(viewsets.ModelViewSet):
    """
    Basic viewset of Post objects. Used to LIST all posts and create a new post at this time.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer2

    def perform_create(self, serializer):
        """
        Creates a new post and assigns the posting_user as the submitting_user &
        (assuming the boardID is in the request data) sets the parent board as well.
        """
        submitting_user = self.request.user
        serializer.save(posting_user=submitting_user, board=self.request.data['board'])


class BoardPatchView(GenericAPIView, UpdateModelMixin):
    queryset = Board.objects.all()
    serializer_class = serializers.BaseBoardSerializer

    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class BoardWithPostsView(viewsets.generics.RetrieveUpdateAPIView):
    """
    Provides a view with the full PostSerializer.
    Used in 'Posts.jsx' to retrieve posts if changing active board doesn't update them.
    """
    queryset = Board.objects.all()
    serializer_class = serializers.BaseBoardSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        posts_check = serializer.data['posts']
        if not posts_check:
            serializer.data['posts'] = "Posts are not defined"
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.data)
