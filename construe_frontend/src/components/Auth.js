import React from 'react';

export {LoginPage, headers}

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-CSRFToken': getCookie()
}


function LoginPage() {
    
    return (
        <div>
            <h3>Login</h3>
            <form>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username' />
                </label>

                <label>
                    Password:
                    <input type='password' name='password' placeholder='password' />
                </label>

                <button type='submit'>Login</button>
            </form>
        </div>
    )
}


function getCookie() {
    const name = 'csrftoken'
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

