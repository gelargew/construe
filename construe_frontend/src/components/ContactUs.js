import React, {useContext, useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { baseUrl, userContext } from './App'
import { getCsrf } from './Auth'


export const ContactUsPage = () => {
    const {user} = useContext(userContext)
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
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
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
            {user.is_authenticated ?
            <>
                <form onSubmit={submitForm} className='contact-form'>
                    <h2>Contact us: </h2>
                    <input type='text' placeholder='title' name='title' required></input>
                    <textarea placeholder='write your message here...' name='message' required></textarea>
                    <button type='submit'>Submit</button>
                </form>
                <h4>Your recent messages: </h4>
                <ul className='messages'>
                    {messages.results.map(message =>
                        <li key={message.id}>
                            <Link className='message-link'  to={`/message/${message.id}`}>
                                <p className='message-title'>
                                    <strong>{message.title} {user.is_staff && <small>{message.user}</small>}</strong> 
                                    <small>  {message.reply_count} replies</small>
                                </p>
                                <p className='message-body'>{message.message}</p>
                            </Link>
                        </li> )}
                </ul>
            </>:
            <p>you need to login to access this page, <Link to='/login'><u>Login</u></Link></p>}
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
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({
                reply_id: message.id,
                message: e.target.body.value,
            })
        })
        if (response.status === 201) {
            const data = await response.json()
            setMessage({...message, replies: [...message.replies, data]})
        }
        e.target.body.value = ''
    }

    return (
        <div className='contactus'>
            {message ?
            <>
                <div className='message-main'>
                    <p className='message-title'>
                        <strong>{message.title ?? '-'}</strong>
                        <small>{message.timestamp}</small>
                    </p>
                    <p className='message-body'>{message.message}</p>
                </div>
                <hr/>
                <ul className='messages'>
                    {message.replies.map(value => 
                        <li key={value.id} className='message-list'>
                            <p className='message-title'><strong>@{value.user}</strong>
                            <small>{toLocalTimestamp(value.timestamp)}</small></p>
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
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric'};
    return new Date(timestamp).toLocaleString('en-US', options)
}