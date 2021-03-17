from django.urls import path

from .views import user_list, user_register, user_login, user_logout


urlpatterns = [
    path('register/', user_register, name='user_register'),
    path('login/', user_login, name='user_login'),
    path('logout/', user_logout, name='user_logout'),
    path('list/', user_list.as_view()),
    path('list/<str:pattern>/', user_list.as_view())
]