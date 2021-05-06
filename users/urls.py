from django.urls import path
from .views import get_current_user, user_list, user_login, user_logout, user_register

urlpatterns = [
    path('login/', user_login),
    path('logout/', user_logout),
    path('register/', user_register),
    path('user_list/<str:pattern>/', user_list.as_view()),
    path('user_list/', user_list.as_view()),
    path('current_user/', get_current_user)
]