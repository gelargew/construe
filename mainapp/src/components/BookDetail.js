import React, { useState, useEffect } from 'react'
import { RentBox } from './RentBox'


export function BookDetail({book, user, setPage}) {
    const [rentBox, setRentBox] = useState(false)

    const showBox = () => {
        if (user.is_authenticated) {
            setRentBox(true)
        }
        else {
            setPage('Login')
        }    
    }
    const hideBox = () => {
        if (rentBox) {
        setRentBox(false)
        }
    }
    useEffect(hideBox, [book])

    return (
        <>
        <div className='book-page' onClick={hideBox}>
            {book.image ? 
            <div>  
                <img className='image' src={book.image} />               
            </div>: ''}
            <div className='book-detail'>
                <h1>{book.title}</h1>
                <p>Year : {book.year}</p>
                <h4>Author: {book.author}</h4>
                <button onClick={showBox}>Rent this book.</button>
                <p>{book.description}</p>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
                <h1>yo</h1>
            </div>
        </div>
        {rentBox && <RentBox hideBox={hideBox} book={book}/>}
        </>
    )
}