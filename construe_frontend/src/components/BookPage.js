import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseUrl } from './App'


export function BookPage() {
    const {pk} = useParams()
    const [book, setBook] = useState({
        title: 'title',
        category: []
    })

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/book/${pk}/`)
        const data = await response.json()
        setBook(data)
        console.log(data)
    }, [pk])

    return (
        <>
            <div className='book-page' >
                <picture>
                    <source className='image' srcSet={book.image} />
                    <img className='image' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png' />               
                </picture>

                <h1>{book.title}</h1>
                <p>{book.author}</p>
                <p>{book.year}</p>
                <p>{book.category.toString()}</p>
            </div>
        </>
    )
}