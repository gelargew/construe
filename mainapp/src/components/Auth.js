import React from 'react'

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-CSRFToken': csrftoken,
}

export function Login({user, setUser}) {
    const loginUser = async (e) => {
        e.preventDefault()
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
        }
        else {
            throw new Error()
        }
    }
    return (
        <div>
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

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}


export function Register({user, setUser}) {
    console.log('register')
    const registerUser = async (e) => {
        e.preventDefault()
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
        console.log(res)
        if (res.status === 201) {
            const data = await res.json()  
            setUser(data)
        }
    }
    return (
        <div>
            <h1>fff</h1>
            <h2>hehehe</h2>
            <form onSubmit={registerUser}>
                <label for="username">
                    Username: 
                    <input type='text' name='username' placeholder='username' />
                </label>
                
                <label for='email'>
                    Password: 
                    <input type='email' name='email' placeholder='email' />
                </label> 

                <label for='password'>
                    Password: 
                    <input type='password' name='password' placeholder='password' />
                </label> 

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
