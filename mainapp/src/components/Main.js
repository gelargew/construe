import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { BookDetail } from './BookDetail'
import { Register, Login } from './auth'
import { Home } from './Home'
import { StaffPage } from './StaffPage'
import { CreateContract } from './ContractCreate'

export function Main({ page, setPage, setUser, user }) {
    const [book, setBook] = useState(0)
    const [books, setBooks] = useState([])

    useEffect(() => {
        if (page != 'Books') setBook(0)
    }, [page])

    return (
        <main>
            <Sidebar setBook={setBook} setPage={setPage} books={books} setBooks={setBooks}/>
            {page === 'Home' ? <Home /> :
            page === 'Login' ? <Login setUser={setUser} setPage={setPage} /> :
            page ==='Register' ? <Register setUser={setUser} setPage={setPage} /> :
            page === 'StaffPage' ? <StaffPage user={user} /> :
            page === 'create contract' ? <CreateContract books={books} /> :
            <BookDetail book={book} setPage={setPage} user={user} />}
        </main>
    )
}