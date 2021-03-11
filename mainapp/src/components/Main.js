import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Content } from './Content'
import { Register, Login } from './auth'
import { Home } from './Home'
import { StaffPage } from './StaffPage'

export function Main({ page, setPage, setUser, user }) {
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
            <Login setUser={setUser} setPage={setPage} /> :
            page ==='Register' ?
            <Register setUser={setUser} setPage={setPage} /> :
            page === 'StaffPage' ?
            <StaffPage user={user} /> :
            <Content book={book} setPage={setPage} user={user} />}
        </main>
    )
}