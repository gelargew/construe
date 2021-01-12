from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields.related import ForeignKey
import math

# Create your models here.


class User(AbstractUser):
    pass

class Quiz(models.Model):
    large = models.BooleanField(default=False)
    user = ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    answers = models.TextField(null=True, blank=True)
    result = models.IntegerField(null=True, blank=True, default=0)
    time = models.IntegerField()
    timestamp = models.DateTimeField(auto_now=True)
    timeleft = models.IntegerField(null=True, blank=True, default=0)

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
            'timestamp': self.timestamp.strftime("%b %#d %Y, %#I:%M %p")
        }

    def size(self):
        return 'large' if self.large else 'small'
    
    def dimension(self):
        return (100, 49) if self.large else (10, 4)

    def time_left(self):
        if self.time < self.timeleft:
            self.timeleft = self.time
        
        minutes = math.floor((self.timeleft/60/1000) % 60)
        seconds = math.floor((self.timeleft/1000) % 60)

        return f'{minutes} minutes {seconds} seconds'
    
    def get_answers(self):
        print(self.answers)
        print(len(self.answers.split(',')))
        return self.answers.split(',')