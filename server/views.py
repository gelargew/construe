from django.utils import timezone
from django.http.response import HttpResponse
from rest_framework.decorators import parser_classes
from server.models import Book
from rest_framework import generics, status
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.response import Response

from .models import Book, Contract
from .serializers import ContractSerializer, BookSerializer

# Create your views here.

class book_list(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class book_create(APIView):
    
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, format=None):
        book = Book.objects.all()
        serializer = BookSerializer(book, many=True)

        return Response(serializer.data)
        
    def post(self, request, format=None):
        data = request.data
        print(data)
        serializer = BookSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()

            return HttpResponse(status=201)
        print(serializer.errors)

        return HttpResponse(status=200)



class contract_list(generics.ListAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

    def get_queryset(self):
        filter = {'expiry__gte': timezone.now(), 'status__in': ('waiting', 'active')}
        if self.request.user.is_staff:
            contracts = Contract.objects.filter(**filter)
            contracts_late = Contract.objects.filter(status='late')
            contracts |= contracts_late
        else:
            contracts = Contract.objects.filter(user=self.request.user, status__in=('waiting', 'active','late', 'returned'))

        return contracts


def contract_create(request, DonateOrRequest=False):
    data = json.loads(request.body)
    if DonateOrRequest:
        book = Book.objects.create(**data['book'])
        
    
    book = Book.objects.get(id=data['bookId'])
    contract = Contract(user=request.user, book=book, duration=data['duration'])
    contract.save()

    return HttpResponse(status=status.HTTP_201_CREATED)


def contract(request, pk, type=None):
    if request.method != 'PATCH' or not type:
        return HttpResponse(status=400)

    contract = Contract.objects.get(pk=pk)
    if type == 'accept' and request.user.is_staff:
        contract.accept()  
    elif type == 'retrieve' and request.user.is_staff:
        contract.returnBook()    
    elif type == 'cancel':
        contract.cancel()
    else:
        return HttpResponse(status=400)
        
    return HttpResponse(status=status.HTTP_200_OK)

