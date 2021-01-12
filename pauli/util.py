from django.contrib.staticfiles.storage import staticfiles_storage
import re
from datetime import datetime, timezone, timedelta
import numpy as np
from numpy.core.arrayprint import array_repr
from numpy.core.numeric import array_equal

def get_quiz(title):
    """
    Retrieves a list of strings numbers for the quiz. If no such
    quiz exists, the function returns None.
    """
    url = staticfiles_storage.url(f"quiz/{title}.md")
    print(url)
    #try:
        
    f = open(url, 'r')
    print(f)
    if title == 'small':

        return [nums[0:5] for nums in f.readlines()]

    else:

        return [nums[0:50] for nums in f.readlines()]

    # except FileNotFoundError:
        
    #     return ''


def get_answer(title):
    """
    Retrieves a list of the answers for the quiz
    """
    try:
        url = staticfiles_storage.url(f"quiz/{title}_answer.md")
        f = open(url, 'r')

        return list(re.sub('\n', '', f.read()))

    except  FileNotFoundError:

        return ''


def results(title, answer):
    """
    compare user answers with the correct answers, return the score
    """
    answer = answer.split(',')
    correct_answer = get_answer(title)
    result = 0
    for ca, ua in zip(correct_answer, answer):
        if ca == ua:
            result += 1
        elif ua == '':
            continue
        else:
            result -=1
    if title == 'large':
        result = result/4900*100
    else:
        result = result/40*100

    return round(result, 2)


def correct_rate(quiz):
    """
    return a 2d array with 1, 0, -1 for correct, empty, and wrong answers. then the correct percentage of each column
    """
    user_ans = quiz.answers.split(',')
    correct_ans = get_answer(quiz.size())

    arr = np.array(list(map(lambda x, y: check(x, y), user_ans, correct_ans)))
    arr = np.reshape(arr, quiz.dimension())

    return arr


def chart_data(quiz):
    
    arr = correct_rate(quiz)
    correct = [round(np.count_nonzero(l == 1)/len(l)*100, 2) for l in arr]
    wrong = [round(np.count_nonzero(l == -1)/len(l)*100, 2) for l in arr]
    empty = [round(np.count_nonzero(l == 0)/len(l)*100, 2) for l in arr]
    print(correct, 'correct')

    return {
        'correct': correct,
        'wrong': wrong,
        'empty': empty
    }


def test_is_expired(quiz):
    """
    return True if the test already past 2 hours or the timer smaller than 5 second left
    """

    if not quiz or datetime.now(timezone.utc) - quiz.timestamp > timedelta(hours=2) or quiz.time < 5*1000:

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