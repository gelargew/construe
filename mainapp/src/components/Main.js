import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Content } from './Content'
import { Register, Login } from './auth'
import { Home } from './Home'

export function Main({ page, setPage }) {
    const [book, setBook] = useState(0)
    useEffect(() => {
        if (page != 'Books') {
            setBook(0)
        }
    }, [page])

    return (
        <main>
            <Sidebar setBook={setBook} setPage={setPage} />
            {page === 'Home' ? 
            <Home /> :
            page === 'Login' ? 
            <Login setUser={setUser} /> :
            page ==='Register' ?
            <Register setUser={setUser} /> :
            <Content book={book} setBook={setBook} />}
        </main>
    )
}