import React, { useState, useEffect } from 'react'
import { Comments } from './Comments'
import { RentBox } from './RentBox'

const RatingImpressions = {
    0: 'no rating',
    1: 'awful',
    2: 'bad',
    3: 'alright',
    4: 'good',
    5: 'excellence!'
}


export function BookDetail({book, user, setPage}) {
    const [rentBox, setRentBox] = useState(false)
    
    const [ratingValue, setRatingValue] = useState(book.rating.rating)
    const [ratingImpression, setRatingImpression] = useState(RatingImpressions[Math.ceil(book.rating.rating)])
    const [ratingAlert, setRatingAlert] = useState('')

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

    useEffect(() => {
        hideBox
        setRatingAlert('')
        setRatingImpression(RatingImpressions[Math.ceil(book.rating.rating)])
        setRatingValue(book.rating.rating)
    }, [book])

    const handleRating = (e) => {
        const tempRating = Math.ceil(e.nativeEvent.offsetX / 20)
        setRatingValue(tempRating)
        setRatingImpression(RatingImpressions[tempRating])
    }

    const handleRatingMouseLeave = (e) => {
        setRatingValue(book.rating.rating)
        setRatingImpression(RatingImpressions[Math.ceil(book.rating.rating)])
    }

    const handleSubmitRating = async () => {
        const response = await fetch(`api/rating/${book.id}/${ratingValue}/`)
        const data = await response.json()
        setRatingValue(data.rating)
        if (response.status === 201) setRatingAlert('your review has been submitted')
        else if (response.status === 200) setRatingAlert('your review has been updated')
    }

    return (
        <>
        <div className='book-page main' onClick={hideBox}>         
            
            <picture>
                <source className='image' srcSet={book.image} />
                <img className='image' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noimage.svg/739px-Noimage.svg.png' />               
            </picture>

            <div className='book-detail'>
                <h2>{book.title}</h2>
                rating: <progress 
                            className='rating' 
                            max='5' value={ratingValue} 
                            onMouseMove={handleRating}
                            onMouseLeave={handleRatingMouseLeave}
                            onClick={handleSubmitRating}>
                        </progress> 
                <span> {ratingImpression} </span>
                <small> (rated by {book.rating.count} {book.rating.count < 2 ? 'user':'users'})</small>
                <p className='rating-alert'><small>{ratingAlert}</small></p>
                <h4>Author: {book.author}</h4>
                <p>Categories : {book.category.toString()}</p>
                <p>Year : {book.year}</p>
                <button onClick={showBox} disabled={book.quantity < 1}>
                    Rent this book.
                </button>
                {book.quantity < 1 && <small>out of order</small>}
                <p>{book.description}</p>

                <Comments book={book} user={user} />
            </div>
        </div>
        {rentBox && <RentBox hideBox={hideBox} book={book} setPage={setPage} />}
        </>
    )
}