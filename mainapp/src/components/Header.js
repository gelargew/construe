import React from 'react'
import { render } from 'react-dom'
import { AuthNav } from './AuthNav'


const logoutUser = async () => {
    const res = await fetch('auth/logout/')
}

export function Header({ user, setUser, setPage, page }) {
    

    return (
    <header>
        <h4 onClick={() => setPage('Home')}>Construe</h4>

        <AuthNav user={user} setUser={setUser} setPage={setPage} />

    </header>
    )
}