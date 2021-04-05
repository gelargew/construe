import json
from django.utils import timezone
from django.http.response import HttpResponse, JsonResponse
from django.db.models import Avg
from server.models import Book
from rest_framework import generics, status
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Book, Comment, Contract, Contract_updater, Rating
from .serializers import CommentSerializer, ContractSerializer, BookSerializer

# Create your views here.

class book_list(generics.ListCreateAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:
            return Book.objects.filter(title__contains=self.kwargs['pattern'])

        return Book.objects.all()


class fresh_book_list(generics.ListAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        return Book.objects.order_by('-pk')[:5]
        


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
   
    mycontracts_count = Contract.objects.filter(user=request.user, status__in=('waiting', 'active', 'late')).count()
    #user can only have up to 3 active contracts at a time
    if mycontracts_count > 3:
        return HttpResponse(status=403)

    data = json.loads(request.body)
    data = {key:int(data[key]) for key in data if data[key]}
    if 'book_id' not in data or not request.user.is_authenticated:       
        return HttpResponse(status=400)

    if 'user_id' in data:
        if not request.user.is_staff:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    else: 
        data |= {'user': request.user}

        
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



class contracts_update(APIView):
    """
    update scheduler, the patch function will validate all contracts by expiration date
    """
    def patch(self, request):
        contract = Contract_updater.objects.all().last()
        if contract and contract.date == timezone.now().date():
            return HttpResponse(status=200)
            
        new_contract = Contract_updater()
        new_contract.save()
        
        return HttpResponse(status=200)

    

def update_rating(request, pk, rating):
    if 0 > rating > 6:
        return HttpResponse(status=400)
    book = Book.objects.get(pk=pk)
    this_rating, created = Rating.objects.get_or_create(book=book, user=request.user)
    this_rating.rating = rating
    this_rating.save()

    new_rating = book.ratings.aggregate(Avg('rating'))

    return JsonResponse({'rating': new_rating['rating__avg']}, status=201 if created else 200)




"""
Reviews and Replies
"""
class CommentView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        if self.kwargs['group'] == 'reviews':
            return Comment.objects.filter(book__pk=self.kwargs['pk'])

        elif self.kwargs['group'] == 'replies':
            return Comment.objects.filter(comment__pk=self.kwargs['pk'])

        return Comment.objects.all()

    def perform_create(self, serializer):
        if self.kwargs['group'] == 'reviews':
            book = Book.objects.get(pk=self.kwargs['pk'])
            serializer.save(user=self.request.user, book=book)
        elif self.kwargs['group'] == 'replies':
            comment = Comment.objects.get(pk=self.kwargs['pk'])
            serializer.save(user=self.request.user, comment=comment)
