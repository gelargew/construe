import json
from datetime import datetime,timezone
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from . import util
from .models import *


def index(request):

    # Authenticated users view index
    if request.user.is_authenticated:
        return render(request, "pauli/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


@login_required
def small(request):
    """
    render small test page
    """
    quiz = Quiz.objects.filter(large=False).first()
    if util.test_is_expired(quiz):
        quiz = Quiz(user=request.user, time=60000, answers=','*39)
        quiz.save()
   
    context = {
        'numbers': util.get_quiz('small'),
        'quiz_id': quiz.id,
        'time': quiz.time,
    }

    return render(request, 'pauli/small.html', context)


@login_required
def large(request):
    """
    render large test page
    """
    quiz = Quiz.objects.filter(large=True).first()
    if util.test_is_expired(quiz):
        quiz = Quiz(large=True, user=request.user, time=3600000, answers=','*4899)
        quiz.save()
    
    context = {
        'numbers': util.get_quiz('large'),
        'quiz_id': quiz.id,
        'time': quiz.time,
    }
    
    return render(request, 'pauli/large.html', context)


def finish(request):
    # user = User.objects.get(id=userid)
    # answers = user.small_answers if quiz == 'small' else user.large_answers
    # result = util.results(quiz, answers)

    return render(request, 'pauli/finish.html', {'result': 'result'})


#render the test history of the current user or all of the users
def history(request, all=None):
    """
    return all tests or all user tests sorted by date
    """
    quizzes = None
    if all == 'all':
        quizzes = Quiz.objects.all()
    elif not all:
        quizzes = request.user.quizzes.all()
    context = {
        'quizzes': [quiz.serialize() for quiz in quizzes],
        'all': all
    }

    return render(request, 'pauli/history.html', context)


def result(request, test_id):
    """
    return the data of a test with id test_id
    """
    result = Quiz.objects.get(id=test_id)
    rate = util.correct_rate(result)

    context = { 
        'result': result.serialize(),
        'timeleft': result.time_left(),
        'result_arr': rate,
        'col_count': result.dimension()[0],
        'row_count': result.dimension()[1]
        }

    return render(request, 'pauli/result.html', context)


@csrf_exempt
@login_required
def save_answer(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    data = json.loads(request.body)
    quiz_id = data.get('quiz_id')
    if quiz_id:
        ans = ','.join(data.get('answers'))
        quiz_id = int(quiz_id)
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.answers = ans
        quiz.result = util.results(quiz.size(), ans)
        time = data.get('time')
        if time > 6000:
            quiz.timeleft = time
        quiz.time = time
        quiz.save()   
    
    return JsonResponse({'cool': 'cool'})


@csrf_exempt
@login_required
def filled_ans(request, quiz_id, size=None):
    """
    return an array of answers of the last test
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required.'}, satus=400)
    print('called')
    quiz = Quiz.objects.get(id=quiz_id)

    return JsonResponse(util.filled_answer(quiz))
    
  
def get_chart_data(request, quiz_id):
    """
    GET API to get data for result chart
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required.'}, satus=400)

    quiz = Quiz.objects.get(id=quiz_id)
    chart_data = util.chart_data(quiz)

    return JsonResponse(chart_data|{'quiz_size':quiz.size()})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "pauli/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "pauli/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]
        username = request.POST['username']
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "pauli/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "pauli/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "pauli/register.html")