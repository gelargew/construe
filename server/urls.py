from django.urls import path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static

from .views import  CommentEdit, CommentView, book_create, book_list, contract_create, contract_list, contract, contracts_update, fresh_book_list, update_rating


urlpatterns = [
    path('books/', book_list.as_view()),
    path('books/<str:pattern>/', book_list.as_view()),
    path('book/create/', book_create.as_view()),
    path('newly_added/', fresh_book_list.as_view()),
    path('contracts/', contract_list.as_view()),
    path('contract/create/', contract_create),
    path('contract/<str:type>/<int:pk>/', contract),
    path('contract_update/', contracts_update.as_view()),
    path('rating/<int:pk>/<int:rating>/', update_rating),
    path('comment/edit/<int:pk>/', CommentEdit.as_view() ),
    path('comment/<str:group>/<int:pk>/', CommentView.as_view()),
] 