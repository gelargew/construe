from django.contrib.staticfiles.storage import staticfiles_storage
import re
from datetime import datetime, timezone, timedelta
import numpy as np
from numpy.core.arrayprint import array_repr
from numpy.core.numeric import array_equal
from numpy.lib import stride_tricks

def last_digit(arr):
    return arr % 10

def get_quiz(title):
    """
    Retrieves a list of numbers for the quiz , a string of its answers and a string of the quiz itself.
    """
    dimension = (10, 5) if title == 'small' else (100, 50)

    arr = np.random.randint(0, 10, dimension)
    answers = (arr[:, :-1] + arr[:, 1:]) % 10
    answers = answers.astype(str).reshape(-1)

    return (
        [[num for num in nums] for nums in arr],
        ','.join(answers),
        ','.join(arr.astype(str).reshape(-1))
        )



def correct_rate(quiz):
    """
    return a 2d array with 1, 0, -1 for correct, empty, and wrong answers. then the correct percentage of each column
    """
    user_ans = quiz.answers.split(',')
    correct_ans = quiz.quiz_ans.split(',')  
    arr = np.array(list(map(lambda x, y: check(x, y), user_ans, correct_ans)))
    arr = np.reshape(arr, quiz.dimension())

    return arr


def chart_data(quiz):
    
    arr = correct_rate(quiz)
    correct = [round(np.count_nonzero(l == 1), 2) for l in arr]
    wrong = [round(np.count_nonzero(l == -1), 2) for l in arr]
    empty = [round(np.count_nonzero(l == 0), 2) for l in arr]
    r, c = quiz.dimension()

    return {
        'correct': correct,
        'wrong': wrong,
        'empty': empty,
        'correct_count': sum(correct),
        'wrong_count': sum(wrong),
        'empty_count': sum(empty),
        'size': r * c
    }


def test_not_valid(quiz):
    """
    return True if the test already past 2 hours or finished
    """
    if not quiz or quiz.status == 'finished':
        
        return True

    elif datetime.now(timezone.utc) - quiz.timestamp > timedelta(hours=2):
        quiz.status = 'expired'
        quiz.save()

        return True

    else:

        return False



def filled_answer(quiz):
    """
    return a dictionary of filled input element id and its answer
    """
    cols, rows = quiz.dimension()
    user_ans = quiz.get_answers()
    user_ans = np.reshape(user_ans, (cols, rows))

    return {
        f'#i-{col + 1}-{row + 1}': user_ans[col][row]
        for col in range(cols)
        for row in range(rows)      
    }


def check(x = '', y = ''):
    if x == '':

        return 0

    elif x == y:

        return 1

    else:

        return -1