from django.utils import timezone
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import parser_classes
from server.models import Book
from rest_framework import generics, status
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
import json
from rest_framework.response import Response

from .models import Book, Contract
from .serializers import ContractSerializer, BookSerializer

# Create your views here.

class book_list(generics.ListCreateAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:
            return Book.objects.filter(title__contains=self.kwargs['pattern'])

        return Book.objects.all()
        


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

        return Response()



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


def contract_create(request):
    data = json.loads(request.body)
    data = {key:int(data[key]) for key in data if data[key]}
    if 'book_id' not in data or not request.user.is_authenticated:       
        return HttpResponse(status=400)
        
    if 'user_id' in data:
        if not request.user.is_staff:
            return HttpResponse(status=status.HTTP_403_FORBIDDEN)
    else: 
        data |= {'user': request.user}
    print(data)
    contract = Contract(**data)
    contract.save()

    return HttpResponse(status=201 if contract else 400)


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

