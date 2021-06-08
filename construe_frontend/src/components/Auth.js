import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { baseUrl, userContext } from './App';

export {LoginPage, RegisterPage, getCsrf}


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
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
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
        <div className='auth-page'>
            <h3>Login</h3>
            <form onSubmit={login}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username' disabled={disabled} required/>
                </label>

                <label>
                    Password:
                    <input type='password' name='password' placeholder='password' disabled={disabled} required/>
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
    const passwordInput = useRef(null)
    const [passwordConfirmed, setPasswordConfirmed] = useState(true)

    const register = async e => {
        e.preventDefault()
        setMessage('')
        setDisabled(true)
        const response = await fetch(`${baseUrl}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
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
        else if (response.status === 403) {
            setMessage('something went wrong, if you are in private mode please enable cookies for csrf token')
        }
        setDisabled(false)
    }
    const confirmPassword = e => {
        setPasswordConfirmed(e.target.value === passwordInput.current.value)
    }

    return (
        <div className='auth-page'>
            <h3>Register</h3>
            <form onSubmit={register}>
                <label>
                    Username:
                    <input type='text' name='username' placeholder='username...' disabled={disabled} 
                    title='Enter an username consisting of 6-16 hexadecimal digits' pattern="[0-9a-zA-Z]{6,16}" required />
                </label>

                <label>
                    email:
                    <input type='email' name='email' placeholder='email...' disabled={disabled} 
                    title='Enter your email' required/>
                </label>

                <label>
                    Password:
                    <input ref={passwordInput} type='password' name='password'
                    pattern="[0-9a-zA-Z]{8,16}" title="Enter an ID consisting of 8-16 hexadecimal digits"
                    placeholder='password...' disabled={disabled} required/>
                </label>

                <label>
                    Confirm password:
                    <input onInput={confirmPassword} type='password' name='confirmpassword' 
                    placeholder='confirm password...' disabled={disabled} title='Confirm your password' required
                    className={passwordConfirmed ? '' : 'alert'} />
                </label>

                <button type='submit' disabled={!passwordConfirmed}>Register</button>
            </form>
            <small>{message}</small>
        </div>
    )
}


const getCsrf = () => {
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