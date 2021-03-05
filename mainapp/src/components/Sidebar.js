import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'


export function Sidebar({ setBook }) {
    const [books, setBooks] = useState([])

    useEffect( async () => {
        const res = await fetch('api/books/')
        const data = await res.json()
        setBooks(Object.values(data))
        console.log(data)
    }, [])

    return (
        <div className='sidebar'>
            <input type='text' placeholder='Search books...'/>
            {!books ? <p>loading</p> : 
            books.map(book => 
                <li onClick={() => setBook(book)}>{book.title}, <small>{book.year}</small></li>)
            }
        </div>
    )
}