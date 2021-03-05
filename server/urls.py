from django.urls import path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static

from .views import book_image, user_detail, user_list, book_detail, book_list


urlpatterns = [
    path('books/', book_list.as_view()),
    path('book/<int:pk>/', book_detail.as_view()),
    path('users/', user_list.as_view()),
    path('user/<int:pk>/', user_detail.as_view()),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
] 