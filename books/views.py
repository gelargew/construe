from django.db.models import query
from django.http.response import HttpResponse
from books.serializers import BookListSerializer
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .serializers import BookListSerializer, CommentSerializer, ContractSerializer, BookSerializer
from .models import Book, Comment, Contract
from .permissions import IsOwnerOrReadOnly, IsStaffOrOwner, fiveBookLimit


class book_list(generics.ListAPIView):
    serializer_class = BookListSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:
            return Book.objects.filter(title__contains=self.kwargs['pattern'])
        
        return Book.objects.all()

    
class book_detail(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class contract_list(generics.ListCreateAPIView):
    queryset = Contract.objects.filter(status__in=['waiting', 'active', 'late'])
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated, fiveBookLimit]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Contract.objects.filter(user=self.request.user)
        
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(**self.request.data)


class contractDetail(generics.RetrieveUpdateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsStaffOrOwner]


class CommentsView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        pk = self.kwargs['pk']
        group = self.kwargs['group']
        if group == 'replies':
            return Comment.objects.filter(reply__pk=pk)
        
        elif group == 'comments':
            return Comment.objects.filter(book__pk=pk)

        return HttpResponse(status=400)

    def perform_create(self, serializer):
        group = self.kwargs['group']
        pk = self.kwargs['pk']
        print(self.kwargs)
        if group == 'replies':
            comment = Comment.objects.get(pk=pk)
            serializer.save(user=self.request.user, reply=comment)
        elif group == 'comments':
            book = Book.objects.get(pk=pk)
            serializer.save(user=self.request.user, book=book)
        else:
            return HttpResponse(status=400)
        

class CommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsStaffOrOwner]
