import React, { useEffect, useState } from 'react'
import {Link, Redirect, useHistory} from 'react-router-dom'
import { baseUrl } from './App'

export const Sidebar = () => {
    const [books, setBooks] = useState({results: []})
    const [url, setUrl] = useState(`${baseUrl}/api/books/`)

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()
        setBooks(data)
    }, [url])


    return (
        <>
            <div className='sidebar'>
                <input type='text' placeholder='Search Books...' 
                onChange={e => setUrl(`${baseUrl}/api/books/${e.target.value}`)} />
                
                <div className='sidebar-book-list'>
                    {books.results.map(book => 
                        <li key={book.slug}>
                            <Link to={`/book/${book.pk}/${book.slug}`} >
                                {book.title}
                            </Link>
                        </li>
                    )}
                </div>

                {/* navigation button */}
                <button onClick={() => setUrl(books.previous)} disabled={!books.previous}>
                    <i className="fas fa-caret-left fa-2x"></i>
                </button>
                
                <button onClick={() =>setUrl(books.next)} disabled={!books.next}>
                    <i className="fas fa-caret-right fa-2x"></i>
                </button>
                
                {books.count ?
                    <p><small>showing {books.results.length} of {books.count} books</small></p> : ''
                }
            </div>
        </>
    )
}