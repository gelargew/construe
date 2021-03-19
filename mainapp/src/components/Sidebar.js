import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'


export function Sidebar({ setBook, setPage, books, setBooks }) {
    const [url, setUrl] = useState('api/books/')
    const bookView = (book) => {
        setPage('Books')
        setBook(book)
    }

    useEffect(async () => {
        const response = await fetch(url)
        if (response.status < 400) {
            const data = await response.json()
            setBooks(data)
        }
        console.log(books)
    }, [url])

    return (
        <div className='sidebar'>
            <input type='text' placeholder='Search books...' onChange={e => setUrl('api/books/' + e.target.value)} />
            {!books.count ? <p>nothing here ...</p> : 
            books.results.map(book => 
                <li onClick={() => bookView(book)}>{book.title}, <small>{book.year}</small></li>)
            }
            <button onClick={() => setUrl(books.previous)} disabled={!books.previous}>
                <i class="fas fa-caret-left"></i>
            </button>
            <button onClick={() =>setUrl(books.next)} disabled={!books.next}>
                <i class="fas fa-caret-right"></i>
            </button>
            
            {books.count &&
                <p><small>showing {books.results.length} of {books.count} books</small></p>
            }
        </div>
    )
}