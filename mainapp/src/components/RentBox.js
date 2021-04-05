import React, { useState, useEffect, useRef } from 'react'
import {headers} from './Auth'

export function RentBox({ hideBox, book, setPage }) {
    const [duration, setDuration] = useState('1 week')
    const handleSelect = (e) => {
        setDuration(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('api/contract/create/', {
            method: 'POST',
            mode: 'same-origin',
            headers: headers,
            body: JSON.stringify({
                duration: parseInt(e.target.duration.value.charAt(0)),
                book_id: book.id,              
            })
        })
        if (res.status === 201) setPage('StaffPage')
    }

    return (
        <div className='rentbox' >
            <p className='button-exit' onClick={hideBox}>X</p>
            <p>Your order: </p>
            <p>{book.title}</p>
            <p>duration: {duration} </p>
            <form onSubmit={handleSubmit}>
                
                <select name='duration' onChange={handleSelect}>
                    <option value='1 week'>1 week</option>
                    <option value='2 weeks'>2 weeks</option>
                    <option value='3 weeks'>3 weeks</option>
                    <option value='4 weeks'>4 weeks</option>
                </select>
                <button className='btn-gray' type='submit'>Submit</button>
            </form>

        </div>
    )
}