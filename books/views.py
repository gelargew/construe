from books.serializers import BookListSerializer
from django.shortcuts import render
from rest_framework import generics

from .serializers import BookListSerializer, ContractSerializer, BookSerializer
from .models import Book, Contract


class book_list(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookListSerializer

    
class book_detail(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class contract_list(generics.ListAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer