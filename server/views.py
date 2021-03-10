from datetime import timedelta
from django.utils import timezone
from django.http.response import HttpResponse
from rest_framework.serializers import Serializer
from server.models import Book
from django.http import JsonResponse
from rest_framework import generics, status
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from PIL import Image
import json

from .models import Book, Contract
from .serializers import ContractSerializer, BookSerializer

# Create your views here.

class book_list(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class book_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class contract_list(generics.ListCreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def get_queryset(self):
        limit = timezone.now() - timedelta(days=1)
        contracts = Contract.objects.filter(expiry__gte=limit)

        return contracts


def contract_create(request):
    data = json.loads(request.body)
    book = Book.objects.get(id=data['bookId'])
    contract = Contract(user=request.user, book=book)
    contract.save(duration=data['duration'])

    return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
