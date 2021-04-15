import React from 'react'
import { Link, Router } from 'react-router-dom'


export function Content() {
    return (
        <Router>
            <nav>
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/Users'>Users</Link>
            </nav>
        </Router>
    )
}