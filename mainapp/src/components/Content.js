import React from 'react'


export function Content({book, setBook}) {
    return (
        <div className='content'>
            <div>
                <img className='image' src={book.image} />
            </div>
            <div className='content-detail'>
                <h1>{book.title}</h1>
                <p>Year : {book.year}</p>
                <h4>Author: {book.author}</h4>
            </div>
        </div>
    )
}