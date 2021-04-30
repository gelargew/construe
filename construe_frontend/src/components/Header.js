import React from 'react';
import { Link } from 'react-router-dom';


export function Header() {
    return (
        <div className='header'>
            <Link to='/'>Home</Link>
            <div className='header-nav'>
                <Link to='/login'>Login</Link>
                <Link to='/logout'>Logout</Link>
                <Link to='/contracts'>contracts</Link>
            </div>
            
        </div>
    )
}