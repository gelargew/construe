import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import { baseUrl, userContext } from './App'
import { getCsrf } from './Auth'



export const Comments = ({group='comments', pk=null}) => {
    const {book_pk} = useParams()
    const {user} = useContext(userContext)
    const [comments, setComments] = useState({results: []})
    const [url, setUrl] = useState(`${baseUrl}/api/comment/${group}/${pk ? pk : book_pk}/`)
    const [hidden, setHidden] = useState('hidden')

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()
        setComments(data)
    }, [url])

    useEffect(() => setUrl(`${baseUrl}/api/comment/${group}/${pk ? pk : book_pk}/`), [book_pk])

    const submitComment = async e => {
        e.preventDefault()
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({
                body: e.target.body.value               
            })
        })
        if (response.status === 201) {
            const data = await response.json()
            setComments({
                ...comments, 
                results: [data, ...comments.results], 
                count: comments.count + 1}
            )
        }
        e.target.body.value = ''
        setHidden('hidden')       
    }

    return (
        <div className='comments'>

            {user.is_authenticated &&
            <form onSubmit={submitComment} className={`${group}-form`}>
                <textarea onFocus={() => setHidden('')} className='comment-input' 
                placeholder={group === 'replies' ? 'add a reply...':'add a review...'} 
                name='body'></textarea>
                <button className={hidden} type='submit'>Submit</button>
                <button className={hidden} type='button' onClick={() => setHidden('hidden')}>Cancel</button>
            </form>}

            <ul className='comment-list'>
                {comments.results.map((comment, idx) => 
                <Comment key={comment.id} comment={comment} setComments={setComments} idx={idx} />)}
            </ul>
            {comments.count > 50 &&
            <>
                <button onClick={() => setUrl(comments.previous)} disabled={!comments.previous}>
                    <i className="fas fa-caret-left fa-2x"></i>
                </button>

                <button onClick={() => setUrl(comments.next)} disabled={!comments.next}>
                    <i className="fas fa-caret-right fa-2x"></i>
                </button>
            </>}

            {group === 'comments' && <small>{comments.results.length} of {comments.count} </small>}
        </div> 
    )
}


const Comment = ({comment, idx, setComments}) => {
    const [tempBody, setTempBody] = useState(comment.body)
    const {user} = useContext(userContext)
    const [editMode, setEditMode] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const cancelEdit = e => {
        setEditMode(false)
        setTempBody(comment.body)
    }

    const submitEdit = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/comment_detail/${comment.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({body: tempBody})
        })
        if (response.status === 200) {
            const data = await response.json()
            setComments(prev => {
                prev.results[idx] = data
                return {...prev}
            })
        }
        setEditMode(false)
    }

    const deleteComment = async e => {
        const response = await fetch(`${baseUrl}/api/comment_detail/${comment.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            }
        })
        if (response.status === 204) {
            setComments(prev => {
                prev.results.splice(idx, 1)
                return {...prev}
            })
        }
    }

    return (
        <li>
            <p className='comment-head'>
                <strong>@{comment.user}</strong>
                <small>{comment.timestamp}</small>
            </p>
            {!editMode ? 
            <>
                <p>{tempBody}</p>
                <div className='comment-option'>
                {user.username === comment.user &&
                    <>
                        <button onClick={() => setEditMode(true)}>Edit</button>
                        <button onClick={deleteComment}>Delete</button>
                    </>}
                    {comment.book && !showReplies && 
                    <button onClick={() => setShowReplies(true)}>{comment.reply_count} replies</button>}
                </div>
            </>
            :
            <form onSubmit={submitEdit}>
                <textarea value={tempBody} onChange={e => setTempBody(e.target.value)} autoFocus></textarea>
                <div className='comment-option'>
                    <button type='submit'>Submit</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </div>
            </form>
            }

            {showReplies && <Comments group='replies' pk={comment.id} />}
            

        </li>
    )
}


const CommentWrite = ()=> {

    const submitComment = async e => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/comment/${group}/${pk}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({
                body: e.target.body.value               
            })
        })
        if (response.status === 201) {
            const data = await response.json()
            setComments({
                ...comments, 
                results: [data, ...comments.results], 
                count: comments.count + 1}
            )
        }
        e.target.body.value = ''
        
    }

    return (
        <form onSubmit={submitComment} className={`${group}-form`}>
            <textarea onFocus={() => setHidden('')} onBlur={() => setHidden('hidden')} 
            className='comment-input' placeholder='write your comment here...' name='body'></textarea>
            <button className={hidden} type='submit'>Submit</button>
        </form>
    )
}