from django.shortcuts import render

# Create your views here.


def index(request, exception=None):
    return render(request, 'construe_frontend/index.html')