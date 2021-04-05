import React from 'react'


export function AuthNav({ user, setUser, setPage }) {
    const logoutUser = async () => {
        const res = await fetch('auth/logout/')
        if (res.status === 200) {
            setUser({username: 'Guest', is_authenticated: false})
            setPage('Home')
        }
    }
    return (
        <div className='header-auth'>
            {user.is_staff && 
            <button onClick={() => setPage('create contract')}>
                New contract
            </button>}

            {user.is_authenticated &&
            <button onClick={() => setPage('StaffPage')}>
                {user.is_staff ? 'contracts':'your books'}
            </button>
            }
            
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