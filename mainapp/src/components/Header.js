import React from 'react'
import { render } from 'react-dom'

export function Header({ user }) {
    

    return (
    <header>
        header
        {user.is_authenticated ?
        <a>Logout</a>:
        <a>Login</a>}
        <h4>{user.username}</h4>
    </header>
    )
}