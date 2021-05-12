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
        console.log(data)
        if (response.status === 201) {
            setMessages({...messages, results: [data, ...messages.results]})
        }
        
    }

    return (
        <div className='contactus'>
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
                            <p className='message-title'>{message.title} <small> {message.timestamp} --- {message.reply_count} replies</small></p>
                            <p className='message-body'>{message.message}</p>
                        </Link>
                    </li> )}
            </ul>
        </div>
    )
}


export const MessagePage = () => {
    const [message, setMessage] = useState()
    const {message_pk} = useParams()

    useEffect(async () => {
        const response = await fetch(`${baseUrl}/api/contactus/${message_pk}/`)
        const data = await response.json()
        setMessage({...data, replies: data.replies.reverse()})
    },[])

    const submitReply = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/contactus/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                reply_id: message.id,
                message: e.target.body.value,
            })
        })
        if (response.status === 201) {
            const data = await response.json()
            setMessage({...message, replies: [...message.replies, data]})
        }
    }

    return (
        <div className='contactus'>
            {message ?
            <>
                <div className='message-main'>
                    <p className='message-title'>{message.title}</p><small>{message.timestamp}</small>
                    <p className='message-body'>{message.message}</p>
                </div>
                <hr/>
                <ul className='messages'>
                    {message.replies.map(value => 
                        <li key={value.id} className='message-list'>
                            <p className='message-title'>@{value.user}<small>{toLocalTimestamp(value.timestamp)}</small></p>
                            <p className='message-body'>{value.message}</p>
                        </li>)}
                </ul>
                <form onSubmit={submitReply}>
                    <textarea name='body' placeholder='add reply' required></textarea>
                    <button>REPLY</button>
                </form>
            </>:
            <h2>Something went wrong</h2>}
        </div>
    )
}

const toLocalTimestamp = timestamp => {
    return new Date(timestamp).toLocaleString()
}