import React, { useEffect, useState } from 'react'
import { headers } from './Auth'
import { Comment } from './Comment'


export function Comments({book=null, user, group='reviews', comment=null}) {
    const [comments, setComments] = useState([])
    const [commentBox, setCommentBox] = useState(false)
    const pk = book ? book.id : comment.id
    
    const loadComments = async e => {
        e.target.disabled = true
        e.target.value = 'loading...'
        const response = await fetch(`api/comment/${group}/${pk}/`)
        if (response.status === 200) {
            const data = await response.json()
            setComments(data)
            console.log(data)
            setCommentBox(true)
        }
    }

    useEffect( () => {
        setCommentBox(false)
    }, [book])

    const submitReview = async e => {
        e.preventDefault()
        const response = await fetch(`api/comment/${group}/${pk}/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ body: e.target.commentInput.value })
        })
    }

    return (
        <>
        {commentBox ?
        <div>
            {user.is_authenticated ?
            <form onSubmit={submitReview}>
                <input type='text' id='commentInput' name='commentInput' placeholder='write your review here...'></input>
                <button type='submit'>Post</button>
            </form>:''}
            <ul>
                {comments.results.map(comment => <Comment key={comment.id} comment={comment} user={user} />)}
            </ul>
        </div>:
        <button onClick={loadComments}>show {group}</button>}
        </>
    )
}