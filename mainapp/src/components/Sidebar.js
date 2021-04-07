import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'


export function Sidebar({ book, setBook, setPage, books, setBooks, page }) {
    const [sidebarHidden, setsidebarHidden] = useState(false)
    const [url, setUrl] = useState('api/books/')
    
    const bookView = (curBook) => {
        setPage('Books')
        setBook(curBook)
    }

    useEffect(async () => {
        const response = await fetch(url)
        if (response.status < 400) {
            const data = await response.json()
            setBooks(data)
        }
    }, [url])

    useEffect( () => {
        setsidebarHidden(true)
    }, [page, book])

    return (
        <>
            <button 
                className='sidebar-toggle' 
                onClick={() => setsidebarHidden(!sidebarHidden)}>
                {sidebarHidden ? 'Find Book':'Back <'}
            </button>

            <div className={sidebarHidden ? 'sb-hidden sidebar' : 'sidebar'}>
                {/* searchable book list link*/}
                <input type='text' placeholder='Search books...' onChange={e => setUrl('api/books/' + e.target.value)} />

                <div className='book-list'>
                    {!books.count ? <p>nothing here ...</p> : 
                    books.results.map(curBook => 
                        <li onClick={() => bookView(curBook)} className={book == curBook && 'book-selected'}>
                            {curBook.title}
                        </li>
                    )}
                </div>

                {/* navigation button */}
                <button onClick={() => setUrl(books.previous)} disabled={!books.previous}>
                    <i class="fas fa-caret-left fa-2x"></i>
                </button>
                
                <button onClick={() =>setUrl(books.next)} disabled={!books.next}>
                    <i class="fas fa-caret-right fa-2x"></i>
                </button>
                
                {books.count ?
                    <p><small>showing {books.results.length} of {books.count} books</small></p> : ''
                }
            </div>
        </>
    )
}