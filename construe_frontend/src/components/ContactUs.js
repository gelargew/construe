import React from 'react'
import { baseUrl } from './App'
import { headers } from './Auth'


export const ContactUsPage = () => {
    
    const submitForm = async e => {
        const response = await fetch(`${baseUrl}/contactus/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                message: e.target.message.value,
                title: e.target.title.value
            })
        })
        const data = await response.json()
        console.log(data)
    }

    return (
        <form onSubmit={submitForm}>
            <input type='text' placeholder='title' name='title'></input>
            <textarea placeholder='write your message here...' name='message'></textarea>
            <button type='submit'>Submit</button>
        </form>
    )
}