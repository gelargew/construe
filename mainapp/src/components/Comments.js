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
            setCommentBox(true)
        }
    }

    useEffect( () => {
        setCommentBox(false)
    }, [book])

    const submitReview = async e => {
        e.preventDefault()
        e.target.disabled = true
        const response = await fetch(`api/comment/${group}/${pk}/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ body: e.target.commentInput.value })
        })
        if (response.status === 201) {
            const data = await response.json()
            setComments(prev => {
                return {
                    ...prev,
                    count: prev.count + 1,
                    results: [data, ...prev.results]
                }
            })
        }
        e.target.value = ''
        e.target.disabled = false
        
    }

    return (
        <>
        {commentBox ?
        <div className='comments'>
            <ul>
                {comments.results.map(comment => <Comment key={comment.id} comment={comment} user={user} />)}
            </ul>

            {user.is_authenticated ?
            <form className='comment-reply' onSubmit={submitReview}>
                <textarea id='commentInput' name='commentInput' 
                placeholder={`write your ${group === 'reviews' ? 'review':'reply'} here...`}>
                </textarea>
                <button type='submit'>Post</button>
            </form>:''}
    
        </div>:

        <button className='comment-show-replies' onClick={loadComments}>show {comments.count} {group}</button>}
        </>
    )
}