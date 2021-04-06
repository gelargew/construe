import React, {useEffect, useRef, useState} from 'react';
import { headers } from './Auth';
import { Comments } from './Comments';


export function Comment({ comment, user }) {
    const [editMode, setEditMode] = useState(false)
    const [body, setBody] = useState(comment.body)
    const [commentStyle, setCommentStyle] = useState('comment')

    const submitEdit = async e => {
        const response = await fetch(`api/comment/edit/${comment.id}/`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                body: body
            })
        })
        setEditMode(false)
    }

    const cancelEdit = () => {
        setEditMode(false)
        setBody(comment.body)
    }

    const deleteComment = async e => {
        const response = await fetch(`api/comment/edit/${comment.id}/`, {
            method: 'DELETE',
            headers: headers
        })
        if (response.status === 204) setCommentStyle('comment hidden')
        
    }

    const handleChange = e => {
        setBody(e.target.value)
    }
    return (
        <li className={commentStyle}>
            <p className='comment-head'><strong>{comment.user}</strong><small>{comment.date}</small></p>
            {!editMode ?
            <p>{body}</p>:
            <textarea onChange={handleChange} value={body} autoFocus></textarea>}
            {comment.comment_owner &&
            <div className='comment-options'>
                {editMode ? 
                <>
                    <button onClick={submitEdit}>submit</button>
                    <button onClick={cancelEdit}>cancel</button>
                </>:
                    <button onClick={() => setEditMode(true)} >edit</button>  
                }
                <button onClick={deleteComment}>delete</button>
            </div>}
            {comment.repliable && <Comments user={user} group='replies' comment={comment}/>}
        </li>
    )
}