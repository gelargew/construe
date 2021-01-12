from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('test/large/', views.large, name='large'),
    path('test/small/', views.small, name='small'),
    path('finish/', views.finish, name='finish'),
    path('history/user/', views.history, name='history'),
    path('history/<str:all>/', views.history, name='history'),
    path('user/result/<int:test_id>', views.result, name='result'),

    # API
    path('answer', views.save_answer, name='answer'),
    path('chart/<int:quiz_id>', views.get_chart_data, name='get_chart_data'),
    path('user_ans/<int:quiz_id>', views.filled_ans, name='filled_answer'),
    path('test/large/user_ans/<int:quiz_id>', views.filled_ans, name='filled_answer'),
    path('test/small/user_ans/<int:quiz_id>', views.filled_ans, name='filled_answer')
]