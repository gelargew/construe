import json

from django.http.response import HttpResponse
from users.serializers import UserSerializer, UserListSerializer
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView

# Create your views here.

def get_current_user(request):
    context = UserSerializer(request.user).data

    return JsonResponse(context)


def user_login(request):
    data = json.loads(request.body)
    user = authenticate(**data)
    if user:
        login(request, user)
        context = UserSerializer(user).data

        return JsonResponse(context, status=200)

    return HttpResponse(status=400)


def user_register(request):
    if request.user.is_authenticated or request.method != 'POST':

        return HttpResponse(status=400)

    data = json.loads(request.body)
    user = authenticate(**data)
    if not user:
        user = User.objects.create_user(**data)
        user.save()
        login(request, user)
        context = UserSerializer(user).data

        return JsonResponse(context, status=201)

    return HttpResponse(status=400)


def user_logout(request):
    logout(request)
    context = UserSerializer(request.user).data
    print(context)

    return JsonResponse(context, status=200)


class user_list(ListAPIView):
    serializer_class = UserListSerializer

    def get_queryset(self):
        if 'pattern' in self.kwargs:

            return User.objects.filter(username__contains=self.kwargs['pattern'])
        
        return User.objects.all()