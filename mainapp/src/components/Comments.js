import React, { useEffect, useState } from 'react'
import { headers } from './Auth'
import { Comment } from './Comment'


export function Comments({book=null, user, group='reviews', comment=null}) {
    const [comments, setComments] = useState([])
    const [commentBox, setCommentBox] = useState(false)
    const pk = book ? book.id : comment.id
    const [url, setUrl] = useState('')

    useEffect( () => {
        setCommentBox(false)
        setUrl(`api/comment/${group}/${pk}/`)
    }, [book])
    
    const loadComments = async (e, url=`api/comment/${group}/${pk}/`) => {
        console.log(url)
        const response = await fetch(url)
        if (response.status === 200) {
            const data = await response.json()
            setComments(data)
            setCommentBox(true)
            console.log(data)
        }
    }

    const submitComment = async e => {
        e.preventDefault()
        e.target.submit.disabled = true
        const response = await fetch(`api/comment/${group}/${pk}/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ body: e.target.commentInput.value })
        })
        if (response.status === 201) {
            loadComments(e, url)
        }      
        commentInput.value = '' 
        e.target.submit.disabled = false
    }

    return (
        <>
        {commentBox ?
        <div className='comments'>
            <ul>
                {comments.results.map(comment => <Comment key={comment.id} comment={comment} user={user} />)}
            </ul>

            <button onClick={e => loadComments(e, comments.previous)} disabled={!comments.previous}>
                <i class="fas fa-caret-left fa-2x"></i>
            </button>
            
            <button onClick={e => loadComments(e, comments.next)} disabled={!comments.next}>
                <i class="fas fa-caret-right fa-2x"></i>
            </button>
                       
            <p><small>showing {comments.results.length} of {comments.count} {group}</small></p>
            
            {user.is_authenticated ?
            <form className='comment-reply' onSubmit={submitComment}>
                <textarea id='commentInput' name='commentInput' 
                placeholder={`write your ${group === 'reviews' ? 'review':'reply'} here...`}>
                </textarea>
                <button name='submit' type='submit'>Post</button>
            </form>:''}
    
        </div>:

        <button className='comment-show-replies' onClick={loadComments}>show {group}</button>}
        </>
    )
}