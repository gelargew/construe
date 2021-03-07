import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'

const App = () => {
    const [user, setUser] = useState({ username: 'Guest', is_authenticated: false })
    const [page, setPage] = useState('Books')

    useEffect(async () => {
        const res = await fetch('api/myprofile/')
        if (res.status === 200) {
            const data = await res.json()
            setUser(data)
            console.log(data)
        }
    }, [])

    return (
    <>
        <Header user={user} setPage={setPage} />
        <Main page={page} setPage={setPage} />
        <Footer />
    </>
    )
}

render(<App />, document.querySelector('.root'))