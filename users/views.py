import json
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http.response import HttpResponse
from rest_framework import status
from rest_framework.generics import ListAPIView

from .serializers import UserListSerializer, UserSerializer



def user_register(request):
    if request.user.is_authenticated or request.method != 'POST':
    
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    data = json.loads(request.body)
    user = authenticate(**data)
    if not user:
        user = User.objects.create_user(**data)
        user.save()
        login(request, user)
        response = UserSerializer(user).data

        return JsonResponse(response, status=status.HTTP_201_CREATED)

    return HttpResponse(status=status.HTTP_409_CONFLICT)


def user_login(request):
    if request.user.is_authenticated:
        response = UserSerializer(request.user).data
        return JsonResponse(response, status=status.HTTP_200_OK)

    elif request.method != 'POST':
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    data = json.loads(request.body)
    user = authenticate(**data)
    print(user)
    if user:
        login(request, user)
        response = UserSerializer(user).data
        return JsonResponse(response, status=status.HTTP_200_OK)

    return HttpResponse(status=status.HTTP_404_NOT_FOUND)


def user_logout(request):
    logout(request)

    return HttpResponse(status=status.HTTP_200_OK)



class user_list(ListAPIView):
    serializer_class = UserListSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:
            return User.objects.filter(username__contains=self.kwargs['pattern'])

        return User.objects.all()[:20]