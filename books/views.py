from books.serializers import BookListSerializer
from django.shortcuts import render
from rest_framework import generics

from .serializers import BookListSerializer
from .models import Book


class book_list(generics.ListAPIView):
    serializer_class = BookListSerializer
    queryset = Book.objects.all()
