import React from 'react';
import { Link } from 'react-router-dom';


export function Header() {
    return (
        <div className='header'>
            <Link to='/'>Home</Link>
            <div className='header-nav'>
                <Link to='Login'>Login</Link>
                <Link to='Logout'>Logout</Link>
            </div>
            
        </div>
    )
}