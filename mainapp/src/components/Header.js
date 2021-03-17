import React from 'react'
import { render } from 'react-dom'
import { AuthNav } from './AuthNav'


const logoutUser = async () => {
    const res = await fetch('auth/logout/')
}

export function Header({ user, setUser, setPage, page }) {
    

    return (
    <header>
        <h4 onClick={() => setPage('Home')}>Home</h4>
        {page}
        {user.is_staff && <button onClick={() => setPage('create contract')}>New contract</button>}
        <button onClick={() => setPage('StaffPage')}>{user.is_staff ? 'contracts':'your rented books'}</button>
        <AuthNav user={user} setUser={setUser} setPage={setPage} />
        <h4>{user.username}</h4>
    </header>
    )
}