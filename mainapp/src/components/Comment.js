import React from 'react';
import { Comments } from './Comments';


export function Comment({ comment, user }) {

    return (
        <li className='comment'>
            <p className='comment-head'><strong>{comment.user}</strong><small>{comment.date}</small></p>
            <p>{comment.body}</p>
            {comment.comment_owner &&
            <div className='comment-options'>
                <button>edit</button>
                <button>delete</button>
            </div>}
            {comment.repliable && <Comments user={user} group='replies' comment={comment}/>}
        </li>
    )
}