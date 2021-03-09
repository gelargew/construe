import React from 'react'
import { render } from 'react-dom'
import { AuthNav } from './AuthNav'


const logoutUser = async () => {
    const res = await fetch('auth/logout/')
}

export function Header({ user, setUser, setPage }) {
    

    return (
    <header>
        header
        <AuthNav user={user} setUser={setUser} setPage={setPage} />
        <h4>{user.username}</h4>
    </header>
    )
}