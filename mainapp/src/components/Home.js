import React, { useEffect, useState } from 'react'

const quotes = [
    ['Books are uniquely portable magic', 'Stephen King'],
    ['Times is a river, and books are boats', 'Dan Brown'],
    ['My library was dukedom large enough', 'William Shakespeare, The Tempest'],
    ['Once you learn to read, you will be forever free', 'Frederick Douglass'],
    ['A reader lives a thousand lives before he dies, said Jojen. The man who never reads lives only one', 'George R.R Martin'],
    ['Reading... A vacation of the mind', 'Dave Barry'],
    ['You will learn most things by looking, but reading gives understanding', 'Paul Rand'],
    ['Reading is to the mind what exercise is to the body', 'Joseph Addison'],
    ['Read a thousand books, and your words will flow like a river', 'Lisa See'],

]

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
}

const getQuote = () => {
    const len = quotes.length
    
    return quotes[getRandomInt(len)]
}


export function Home() {
    const [quote, quotee] = getQuote()
    const [newBooks, setNewBooks] = useState({})

    useEffect(async () => {
        const response = await fetch('api/newbooks/')
        if (response.status < 400) {
            const data = await response.json()
            setNewBooks(data)
        }
    }, [])

    return (
    <div className='Home'>
        <h1>CONSTRUE</h1>
        <p>"{quote}" <em>-{quotee}</em></p>
        <div>
            <h3>Newly added: </h3>
        
        </div>
        
    </div>
    )
}