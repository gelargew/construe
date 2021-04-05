import React from 'react'



export const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-CSRFToken': getCookie(),
}
export function Login({ setUser, setPage }) {
    const loginUser = async (e) => {
        e.preventDefault()
        console.log(getCookie())
        const res = await fetch('auth/login/', {
            method: 'POST',
            mode: 'same-origin',
            headers: headers,
            body: JSON.stringify({
                'username': e.target.username.value,
                'password': e.target.password.value,
            })
        })
        if (res.status === 200) {
            const data = await res.json()  
            setUser(data)
            setPage('Home')
            updateContracts(data)
        }
        else {
            throw new Error()
        }
    }
    return (
        <div className='auth-page main'>
            <h2>Login</h2>
            <form onSubmit={loginUser}>
                <label for="username">
                    Username: 
                    <input type='text' name='username' placeholder='username' />
                </label>

                <label for='password'>
                    Password: 
                    <input type='password' name='password' placeholder='password' />
                </label> 

                <button type='submit'>Login</button>
                <a onClick={() => setPage('Register')}>Don't have an account? Register.</a>
            </form>
        </div>
    )
}


export function Register({ setUser, setPage }) {
    const registerUser = async (e) => {
        e.preventDefault()
        console.log(headers)
        const res = await fetch('auth/register/', {
            method: 'POST',
            mode: 'same-origin',
            headers: headers,
            body: JSON.stringify({
                'username': e.target.username.value,
                'password': e.target.password.value,
                'email': e.target.email.value
            })
        })
        if (res.status === 201) {
            const data = await res.json()  
            setUser(data)
            setPage('Home')
        }
    }
    return (
        <div className='auth-page main'>
            <h2>Register Page</h2>
            <form onSubmit={registerUser}>
                <label for="username">
                    Username: 
                    <input type='text' name='username' placeholder='username' />
                </label>
                
                <label for='email'>
                    Email: 
                    <input type='email' name='email' placeholder='email' />
                </label> 

                <label for='password'>
                    Password: 
                    <input type='password' name='password' placeholder='password' />
                </label> 

                <button type='submit'>Register</button>
                <a onClick={() => setPage('Login')}>Have an account? Login.</a>
            </form>
        </div>
    )
}




export function updateContracts(user) {
    // try to check and update status for expired and late contract each time a staff logged in
    if (user.is_staff) {
        fetch('api/contract_update/', {
            method: 'PATCH',
            headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,}
        })
    }
}


export function getCookie() {
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