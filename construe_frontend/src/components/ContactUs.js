import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { baseUrl } from './App'
import { headers } from './Auth'


export const ContactUsPage = () => {
    const [messages, setMessages] = useState({results: []})
    
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
            <form onSubmit={submitForm}>
                <input type='text' placeholder='title' name='title'></input>
                <textarea placeholder='write your message here...' name='message'></textarea>
                <button type='submit'>Submit</button>
            </form>
            <div className='messages'>
                {messages.results.map(message => 
                    <Link key={message.id} to={`/message/${message.id}/${message.slug}`}>
                        {message.title} ---- {message.message.slice(0, 20)} --- replies: {message.reply_count}
                    </Link>)}
            </div>
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
                <div>
                    {message.replies.map(value => 
                        <li>
                            <h4>{value.title}</h4><small>{value.timestamp}</small>
                            <p>{value.message}</p>
                        </li>)}
                </div>
            </>:
            <h2>Something went wrong</h2>}
        </>
    )
}

