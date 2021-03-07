import React, { useState } from 'react'
import { RentBox } from './RentBox'


export function Content({book, setBook}) {
    const [rentBox, setRentBox] = useState(false)

    const showBox = () => {
        setRentBox(true)
    }
    const hideBox = () => {
        if (rentBox) {
        setRentBox(false)
        }
    }

    return (
        <>
        <div className='content' onClick={hideBox}>
            <div>
                <img className='image' src={book.image} />
            </div>
            <div className='content-detail'>
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
        {rentBox && <RentBox />}
        </>
    )
}