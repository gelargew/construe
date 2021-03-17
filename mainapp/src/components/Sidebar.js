import React, {useState, useEffect} from 'react'
import {render} from 'react-dom'


export function Sidebar({ setBook, setPage, books, setBooks }) {

    const bookView = (book) => {
        setPage('Books')
        setBook(book)
    }

    return (
        <div className='sidebar'>
            <input type='text' placeholder='Search books...'/>
            {!books ? <p>loading</p> : 
            books.map(book => 
                <li onClick={() => bookView(book)}>{book.title}, <small>{book.year}</small></li>)
            }
        </div>
    )
}