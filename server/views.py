from django.http.response import HttpResponse
from rest_framework.serializers import Serializer
from server.models import Book
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from PIL import Image
import json

from .models import Book
from .serializers import *

# Create your views here.

class book_list(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class book_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
