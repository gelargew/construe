import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { baseUrl, userContext } from './App'
import { headers } from './Auth'
import { Comments } from './Comments'


export const BookPage = () => {
    const [showBox, setShowBox] = useState(false)
    const {user} = useContext(userContext)
    const {book_pk} = useParams()
    const [book, setBook] = useState({
        title: 'title',
        category: [],
        likes: {count: 0, dislike: 0}
    })
    const [message, setMessage] = useState('')

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/book/${book_pk}/`)
        const data = await response.json()
        setBook(data)
        setMessage('')
    }, [book_pk])

    const rentBook = async e => {       
        if (user.contracts.includes(book.id)) {
            console.log('ASDAWDAWD')
            setMessage('you have an active contract of this book')
            return
        }        
        setShowBox(true)       
    }

    const submitLike = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/book/${book_pk}/${e.currentTarget.value}/`, {
            method: 'PUT',
            headers: headers
        })
        if (response.status === 200) {
            const data = await response.json()
            setBook(data)
        }
        
    }

    return (
        <>
            <div className='book-page' >
                <picture>
                    <source className='image' srcSet={book.image} />
                    <img className='image' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png' />               
                </picture>

                <div className='book-detail'>
                    <div>
                        <button value='like' onClick={submitLike}>
                            <i className="far fa-thumbs-up"></i>
                        </button> <small>{book.likes.count}</small>
                        <button value='dislike' onClick={submitLike}>
                            <i className="far fa-thumbs-down"></i>
                        </button><small>{book.likes.dislikes}</small>
                    </div>
                    <h1>{book.title}</h1>
                    <p>{book.author}</p>
                    <p>{book.year}</p>
                    <p>{book.category.toString()}</p>

                    {book.quantity > 0 ?
                        <button onClick={rentBook}>Rent this book</button>:
                        <p><small>book currently unavailable</small></p>}
                    <small>{message}</small>
                </div>

                <Comments />

            </div>
            {showBox && <ContractBox setShowBox={setShowBox} book={book} />}
        </>
    )
}


const ContractBox = ({setShowBox, book}) => {
    const {user, setUser} = useContext(userContext)
    const history = useHistory()
    const [message, setMessage] = useState('')

    const toggle = e => setShowBox(e.target.className != 'box-layout')

    const submitForm = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/contracts/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                book_id: book.id,
                duration: e.target.duration.value,
                user_id: user.id
            })
        })
        if (response.status === 201) {
            setUser(prev => {
                prev.contracts = [...prev.contracts, book.id]
                return {...prev}
            })
            history.push('/contracts')
            return
        }
        setMessage('something went wrong')
    }
    
    return(
        <div className='box-layout' name='box-layout' onClick={toggle}>
            <div className='contract-box'>
                <form onSubmit={submitForm}>
                    <p>request your book beforehand, our bookkeeper will prepare the book for you. save your time!</p>
                    <h5>{book.title}</h5>
                    <h6>{book.author}</h6>
                    <label>
                        how long do you intend to borrow the book?
                        <select name='duration'>
                            <option value='7'>1 week</option>
                            <option value='14'>2 weeks</option>
                            <option value='21'>3 weeks</option>
                            <option value='28'>4 weeks</option>
                        </select>
                    </label>

                    <p>you have 1 day to take your book after you submit your request </p>

                    <button type='submit'>Request book</button>
                </form>
                <small>{message}</small>
            </div>
        </div>
    )
}