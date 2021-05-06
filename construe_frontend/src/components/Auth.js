import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { baseUrl, userContext } from './App';

export {LoginPage, RegisterPage, headers}


const getCookie = () => {
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

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-CSRFToken': getCookie()
}


const LoginPage = () => {
    const [message, setMessage] = useState('')
    const {setUser} = useContext(userContext)
    const history = useHistory()
    const [disabled, setDisabled] = useState(false)
    
    const login = async e => {
        e.preventDefault()
        setMessage('')
        setDisabled(true)
        const response = await fetch(`${baseUrl}/auth/login/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        })
        if (response.status === 200) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
        else {
            setMessage('something went wrong, please try again')
            setDisabled(false)
        }
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={login}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username' disabled={disabled}/>
                </label>

                <label>
                    Password:
                    <input type='password' name='password' placeholder='password' disabled={disabled} />
                </label>

                <button type='submit' disabled={disabled}>Login</button>
            </form>
            <small>{message}</small>
        </div>
    )
}


const RegisterPage = () => {
    const [message, setMessage] = useState('')
    const {setUser} = useContext(userContext)
    const history = useHistory()
    const [disabled, setDisabled] = useState(false)
    
    const register = async e => {
        e.preventDefault()
        setMessage('')
        setDisabled(true)
        const response = await fetch(`${baseUrl}/auth/register/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
                email: e.target.email.value
            })
        })
        if (response.status === 201) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
        else {
        setMessage('something went wrong, please try again')
        setDisabled(false)
        }
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={register}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username' disabled={disabled} />
                </label>

                <label>
                    email:
                    <input type='email' name='email' placeholder='email' disabled={disabled} />
                </label>

                <label>
                    Password:
                    <input type='password' name='password' placeholder='password' disabled={disabled} />
                </label>

                <button type='submit'>Register</button>
            </form>
            <small>{message}</small>
        </div>
    )
}


const handleAuth = async (e, type='login', body) => {
    e.preventDefault()
    const response = await fetch(`${baseUrl}/auth/${type}/`, {
        method: 'POST',
        mode: 'same-origin',
        headers: headers,
        body: body
    })
    return response

}



