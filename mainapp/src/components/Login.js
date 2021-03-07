import React from 'react'


export function Login() {
    return (
        <div>
            <h2>Login</h2>
            <form>
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