import React from 'react'


export function AuthNav({ user, setUser, setPage }) {
    const logoutUser = async () => {
        const res = await fetch('auth/logout/')
        if (res.status === 200) {
            setUser({username: 'Guest', is_authenticated: false})
            setPage('Books')
        }
    }
    return (
        <div className='header-auth'>
            {user.is_authenticated ?
            <button onClick={logoutUser}>Logout</button> :
            <>
                <button onClick={() => setPage('Login')}>Login</button>
                <button onClick={() => setPage('Register')}>Register</button>
            </>}
            <strong>{user.username}</strong>
        </div>
    )
}