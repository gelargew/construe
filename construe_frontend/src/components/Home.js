import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { baseUrl } from './App'


export const Home = () => {
    const [[quote, quotee], setQuote] = useState(['',''])
    const [books, setBooks] = useState({results:[]})

    useEffect(async () => {
        setQuote(quotes[getRandomInt(quotes.length)])
        const response = await fetch(`${baseUrl}/api/newbooks/`)
        const data = await response.json()
        setBooks(data)
    }, [])

    return (
        <div className='main home'>
            <h1>CONSTRUE</h1>
            <div className='quote'>
                <p>"{quote}"</p>
                <em>-{quotee}</em>
            </div>

            <div className='newbooks'>
                {books.results.map(book => 
                    <Link key={book.id} to={`book/${book.id}/${book.slug}`}>
                        <div>
                            <h4>{book.title}</h4>
                            <p>{book.author}</p>
                        </div>
                    </Link>)}
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