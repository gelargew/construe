import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { baseUrl } from './App'
import { headers } from './Auth'


export const ContactUsPage = () => {
    const [messages, setMessages] = useState({results: []})

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/contactus/`)
        const data = await response.json()
        if (response.status === 200) setMessages(data)
    },[])
    
    const submitForm = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/contactus/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                message: e.target.message.value,
                title: e.target.title.value
            })
        })
        const data = await response.json()
        if (response.status === 201) {
            setMessages({...messages, results: [data, ...messages.results]})
        }
        
    }

    return (
        <>
            <form onSubmit={submitForm} className='contact-form'>
                <h2>Contact us: </h2>
                <input type='text' placeholder='title' name='title' required></input>
                <textarea placeholder='write your message here...' name='message' required></textarea>
                <button type='submit'>Submit</button>
            </form>
            <ul className='messages'>
                {messages.results.map(message =>
                    <li key={message.id}>
                        <Link className='message-link'  to={`/message/${message.id}/${message.slug}`}>
                            <p className='message-title'>{message.title} <small> {message.reply_count} replies</small></p>
                            <p className='message-body'>{message.message}</p>
                        </Link>
                    </li> )}
            </ul>
        </>
    )
}


export const MessagePage = () => {
    const [message, setMessage] = useState()
    const {message_pk} = useParams()

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/contactus/${message_pk}/`)
        const data = await response.json()
        console.log(data)
        setMessage(data)
    },[])

    return (
        <>
            {message ?
            <>
                <div>
                    <h4>{message.title}</h4><small>{message.timestamp}</small>
                    <p>{message.message}</p>
                </div>
                <ul className='messages'>
                    {message.replies.map(value => 
                        <li className='message-list'>
                            <p className='message-title'>{value.title}<small>{value.timestamp}</small></p>
                            <p className='message-body'>{value.message}</p>
                        </li>)}
                </ul>
            </>:
            <h2>Something went wrong</h2>}
        </>
    )
}

