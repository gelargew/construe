import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Content } from './Content'
import { Login } from './Login'

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
            {book ? 
            <Content book={book} setBook={setBook} />:
            <Login />}
        </main>
    )
}