from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields.related import ForeignKey
import math

# Create your models here.

STATUS_CHOICES = [
    ('finished', 'finished'),
    ('pending', 'pending'),
    ('expired','expired')
]

class User(AbstractUser):
    pass

class Quiz(models.Model):
    large = models.BooleanField(default=False)
    user = ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    quiz = models.TextField(null=True, blank=True)
    quiz_ans = models.TextField(null=True, blank=True)
    answers = models.TextField(null=True, blank=True)
    result = models.IntegerField(null=True, blank=True, default=0)
    time = models.IntegerField()
    timestamp = models.DateTimeField(auto_now=True)
    timeleft = models.IntegerField(null=True, blank=True, default=0)
    status = models.CharField(choices=STATUS_CHOICES, default='pending', max_length=12, null=True, blank=True)


    class Meta:
        ordering = ['-timestamp']

    def __str__(self) -> str:
        return f'test_id:{self.id} --by:{self.user.username} --large_quiz: {self.large}'

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.username,
            'large': self.size(),
            'time': self.time,
            'answers': self.get_answers(),
            'result': self.result,
            'timestamp': self.timestamp.strftime("%b %#d %Y, %#I:%M %p"),
            'status': self.status
        }

    def size(self):
        return 'large' if self.large else 'small'
    
    def dimension(self):
        return (100, 49) if self.large else (10, 4)

    def time_left(self):

        minutes = math.floor((self.time/60/1000) % 60)
        seconds = math.floor((self.time/1000) % 60)

        return f'{minutes} minutes {seconds} seconds'
    
    def get_answers(self):

        return self.answers.split(',')