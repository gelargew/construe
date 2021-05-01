import React, { useEffect, useState } from 'react'
import {Link, Redirect} from 'react-router-dom'
import { baseUrl } from './App'

export function Sidebar() {
    const [books, setBooks] = useState({results: []})
    const [url, setUrl] = useState(`${baseUrl}/api/books/`)

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()
        setBooks(data)
        console.log(data)
    }, [url])


    return (
        <>
            <div className='sidebar'>
                <input type='text' placeholder='Search Books...' />
                
                <div className='sidebar-book-list'>
                    {books.results.map(book => 
                        <Link to={`/book/${book.pk}/${book.slug}`} key={book.slug}>
                            {book.title}
                        </Link>
                    )}
                    <Link to='/book/231'>BOOKPAGE</Link>
                </div>
            </div>
        </>
    )
}