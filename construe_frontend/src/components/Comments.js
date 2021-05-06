import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router'
import { baseUrl, userContext } from './App'
import { headers } from './Auth'



export const Comments = ({group='comments', pk=null}) => {
    pk ??= useParams().book_pk
    const [comments, setComments] = useState({results: []})
    const [showComments, setShowComments] = useState(false)
    const [url, setUrl] = useState(`${baseUrl}/api/comment/${group}/${pk}/`)

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()
        setComments(data)
        setShowComments(false)
        console.log(pk)
    }, [url, pk])

    const submitComment = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/'api/comment/${group}/${pk}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                body: e.target.body.value,
                
            })
        })
        const data = await response.json()
        console.log(data)
        console.log('submited')
    }

    return (
        <>
            {!showComments ? 
            <button onClick={() => setShowComments(true)}>show comments</button>:
            <>
                <form onSubmit={submitComment}>
                    <textarea placeholder='write your comment here...' name='body'></textarea>
                    <button type='submit'>Submit</button>
                </form>
                <ul className='comments'>
                    {comments.results.map((comment, idx) => 
                    <Comment key={comment.id} comment={comment} setComments={setComments} idx={idx} />)}
                </ul>

                <button onClick={() => setUrl(comments.previous)} disabled={!comments.previous}>
                    <i className="fas fa-caret-left fa-2x"></i>
                </button>

                <button onClick={() => setUrl(comments.next)} disabled={!comments.next}>
                    <i className="fas fa-caret-right fa-2x"></i>
                </button>

                <small>{comments.results.length} of {comments.count} </small>
            </> }
        </>
    )
}


const Comment = ({comment, idx, setComments}) => {
    const [tempBody, setTempBody] = useState(comment.body)
    const {user} = useContext(userContext)
    const [editMode, setEditMode] = useState(false)

    return (
        <li>
            <p>
                <strong>@{comment.user}</strong>
                <small>{comment.timestamp}</small>
            </p>
            {!editMode ? <p>{tempBody}</p>:
            <textarea value={tempBody} ></textarea>}
            
            {user.username === comment.user &&
                <div className='comment-option'>
                    {editMode ?
                    <>
                        <button >Submit</button>    
                        <button>Cancel</button>
                    </>:
                    <>
                        {user.is_authenticated && <button>Reply</button>}
                        <button>Edit</button>
                        <button>Delete</button>
                    </>
                }
                </div>
            }
            {comment.book && <Comments group='replies' pk={comment.id} />}
        </li>
    )
}


const CommentWrite = ()=> {

    return (
        <form>
            <textarea placeholder='write your comment here...'></textarea>
            <button type='submit'>Post</button>
        </form>
    )
}