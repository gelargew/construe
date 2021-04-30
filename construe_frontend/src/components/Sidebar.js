import React from 'react'
import {Link, Redirect} from 'react-router-dom'

export function Sidebar() {
    return (
        <>
            <div className='sidebar'>
                <input type='text' placeholder='Search Books...' />
                
                <div className='sidebar-book-list'>
                    <Link to='/book/231' replace>BOOKPAGE</Link>
                </div>
            </div>
        </>
    )
}