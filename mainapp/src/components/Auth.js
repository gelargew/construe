import React from 'react'

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
}
export function Login({ setUser, setPage }) {
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
            setPage('Books')
            updateContracts(data)
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


export function Register({ setUser, setPage }) {
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
        if (res.status === 201) {
            const data = await res.json()  
            setUser(data)
            setPage('Books')
        }
    }
    return (
        <div>
            <h2>Register Page</h2>
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




export function updateContracts(user) {
    // try to check and update status for expired and late contract each time a staff logged in
    if (user.is_staff) {
        fetch('api/contract_update/', {
            method: 'PATCH',
            headers: {'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,}
        })
    }
}