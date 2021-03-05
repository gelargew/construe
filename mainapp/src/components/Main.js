import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Content } from './Content'

export function Main() {
    const [book, setBook] = useState({title: 'hello'})

    return (
        <main>
            <Sidebar setBook={setBook} />
            <Content book={book} setBook={setBook} />
        </main>
    )
}