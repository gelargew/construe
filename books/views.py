from books.utils import noPagination, valid_report
from django.http.response import Http404, HttpResponse, JsonResponse
from books.serializers import BookListSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import exceptions

from .serializers import (BookListSerializer, 
                        CommentSerializer, 
                        ContactUsDetailSerializer, 
                        ContactUsSerializer, 
                        ContractSerializer, 
                        BookSerializer)
from .models import Book, Comment, ContactUs, Contract
from .permissions import IsStaffOrOwner, fiveBookLimit

status_filter = ('waiting', 'late', 'active')

class book_list(generics.ListAPIView):
    serializer_class = BookListSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:
            return Book.objects.filter(title__icontains=self.kwargs['pattern'])
        
        return Book.objects.all()


class new_books(generics.ListCreateAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.all().order_by('-pk')[:4]

    
class book_detail(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


def book_like(request, pk, like='like'):
    if request.method == 'PUT':
        book = Book.objects.get(pk=pk)
        if like == 'like':
            book.dislike.remove(request.user)
            book.like.add(request.user)
        elif like == 'dislike':
            book.like.remove(request.user)
            book.dislike.add(request.user)
        context = BookSerializer(book).data

        return JsonResponse(context, status=200)
    
    return HttpResponse(status=404)


class contract_list(generics.ListCreateAPIView):
    queryset = Contract.objects.filter(status__in=status_filter)
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Contract.objects.filter(user=self.request.user, status__in=status_filter)
        
        return super().get_queryset()

    def perform_create(self, serializer):
        contracts = Contract.objects.filter(user=self.request.user, status__in=status_filter)
        # limit to 5 active contracts per user(non staff)  
        if not self.request.user.is_staff and contracts.count() > 5:
            raise exceptions.PermissionDenied('You have too many active contracts')
        
        serializer.save(**self.request.data)
        


class contractDetail(generics.RetrieveUpdateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsStaffOrOwner]


class CommentsView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = noPagination

    def get_queryset(self):
        pk = self.kwargs['pk']
        group = self.kwargs['group']
        #if the request come from the replies group, return all the comments for a certain comment
        if group == 'replies':            
            return Comment.objects.filter(reply__pk=pk)
        
        # if the request come from the comments group, return all the comments for a certain book
        elif group == 'comments':
            return Comment.objects.filter(book__pk=pk)

        return HttpResponse(status=400)

    def perform_create(self, serializer):
        group = self.kwargs['group']
        pk = self.kwargs['pk']
        if group == 'replies':
            comment = Comment.objects.get(pk=pk)
            serializer.save(user=self.request.user, reply=comment)
        elif group == 'comments':
            book = Book.objects.get(pk=pk)
            serializer.save(user=self.request.user, book=book)
        else:
            raise exceptions.ValidationError('bad request')
        

class CommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsStaffOrOwner]


class ContactUsView(generics.ListCreateAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # if not valid_report(self.request.user):
        #     raise exceptions.PermissionDenied('you have sent too many messages')        
        serializer.save(user=self.request.user, **self.request.data)
  
    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactUs.objects.filter(reply=None)
        return ContactUs.objects.filter(reply=None, user=self.request.user)


class ContactUsDetail(generics.RetrieveDestroyAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsDetailSerializer
    permission_classes = [IsAuthenticated]


