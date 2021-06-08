import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { baseUrl } from './App'

export const Sidebar = () => {
    const [books, setBooks] = useState({results: []})
    const [url, setUrl] = useState(`${baseUrl}/api/books/`)
    // this is only for small window width
    const [sidebarHidden, setSidebarHidden] = useState(true)

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()
        setBooks(data)
    }, [url])


    return (
        <>
            <button className={sidebarHidden ? 'toggle-sidebar' : 'toggle-sidebar sb-hidden'} 
            onClick={() => setSidebarHidden(!sidebarHidden)}>
                {sidebarHidden ? 'Find Books' : 'X'}
            </button>

            <div className={sidebarHidden ? 'sidebar sb-hidden' : 'sidebar'}>
                <input type='text' placeholder='Search Books...' 
                onChange={e => setUrl(`${baseUrl}/api/books/${e.target.value}`)} />
                
                <div className='sidebar-book-list'>
                    {books.results.map(book => 
                        <Link key={book.pk} to={`/book/${book.pk}/${book.slug}`} >
                            {book.title}
                        </Link>                       
                    )}
                </div>

                {/* navigation button */ books.count > 20 &&
                <>
                    <button onClick={() => setUrl(books.previous)} disabled={!books.previous}>
                        <i className="fas fa-caret-left fa-2x"></i>
                    </button>
                    
                    <button onClick={() =>setUrl(books.next)} disabled={!books.next}>
                        <i className="fas fa-caret-right fa-2x"></i>
                    </button>
                </>}
                
                {books.count 
                    ?
                    <p><small>showing {books.results.length} of {books.count} books</small></p> 
                    : 
                    ''
                }
            </div>
        </>
    )
}