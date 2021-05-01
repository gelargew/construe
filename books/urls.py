from django.urls import path

from .views import book_detail, book_list, contract_list

urlpatterns = [
    path('books/', book_list.as_view()),
    path('contracts/', contract_list.as_view()),
    path('book/<int:pk>/', book_detail.as_view())
]