import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseUrl, userContext } from './App'
import { headers } from './Auth'
import { Comments } from './Comments'


export const BookPage = () => {
    const [showBox, setShowBox] = useState(false)
    const {user} = useContext(userContext)
    const {book_pk} = useParams()
    const [book, setBook] = useState({
        title: 'title',
        category: []
    })
    const [showComments, setShowComments] = useState(false)

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/book/${book_pk}/`)
        const data = await response.json()
        setBook(data)
    }, [book_pk])

    const rentBook = async e => {
        setShowBox(true)
        const response = await fetch(`${baseUrl}/api/contracts/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                book_id: book.id,
                user_id: user.id
            })
        })
        const data = await response.json()
    }

    return (
        <>
            <div className='book-page' >
                <picture>
                    <source className='image' srcSet={book.image} />
                    <img className='image' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png' />               
                </picture>

                <div className='book-detail'>
                    <h1>{book.title}</h1>
                    <p>{book.author}</p>
                    <p>{book.year}</p>
                    <p>{book.category.toString()}</p>
                    <button onClick={rentBook}>Rent this book</button>
                </div>

                <Comments />

            </div>
            {showBox && <ContractBox setShowBox={setShowBox} />}
        </>
    )
}


const ContractBox = ({setShowBox}) => {

    const toggle = e => setShowBox(e.target.className != 'box-layout')
    
    return(
        <div className='box-layout' name='box-layout' onClick={toggle}>
            <div className='contract-box'>
                <h1>this is rentbax</h1>
            </div>
        </div>
    )
}