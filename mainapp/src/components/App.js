import React, { useEffect, useReducer, useState } from 'react'
import { render } from 'react-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'


const App = () => {
    const [user, setUser] = useState({ username: 'Guest', is_authenticated: false })
    const [page, setPage] = useState('Home')

    useEffect(async () => {
        const res = await fetch('auth/login/')
        console.log(res)
        if (res.status === 200) {
            const data = await res.json()
            setUser({...data, type: 'login'})
            console.log(user)
        }
    }, [])

    return (
    <>
        <Header user={user} setUser={setUser} setPage={setPage} />
        <Main page={page} setPage={setPage} />
    </>
    )
}

render(<App />, document.querySelector('.root'))