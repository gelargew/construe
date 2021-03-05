from django.http.response import HttpResponse
from server.models import Book
from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth.models import User
from PIL import Image

from .models import Book
from .serializers import *

# Create your views here.

class book_list(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class book_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class user_list(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class user_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


def book_image(request, filename):
    file_url = f'bookAssets/{filename}'
    with open(file_url, 'rb') as f:
        img = Image.open(f)
        print(img)
        return HttpResponse(img, content_type='image/jpg')
