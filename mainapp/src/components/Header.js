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
        <AuthNav user={user} setUser={setUser} setPage={setPage} />
        {user.is_staff && <button onClick={() => setPage('StaffPage')}>Order</button>}
        <h4>{user.username}</h4>
    </header>
    )
}