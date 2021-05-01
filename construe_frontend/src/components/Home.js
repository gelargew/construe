import React, {useState, useEffect} from 'react'


export function Home() {
    const [[quote, quotee], setQuote] = useState(['',''])

    useEffect(async () => {
        setQuote(quotes[getRandomInt(quotes.length)])
    }, [])

    return (
        <div className='main home'>
            <h1>CONSTRUE</h1>
            <div className='quote'>
                <p>"{quote}"</p>
                <em>-{quotee}</em>
            </div>
        </div>
    )
}

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