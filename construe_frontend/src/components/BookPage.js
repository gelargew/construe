import React from 'react'
import { useParams } from 'react-router-dom'


export function BookPage() {
    const {id} = useParams()

    return (
        <>
            <div className='book-page' >
                <h1> BOOK PAGE {id}</h1>
            </div>
        </>
    )
}