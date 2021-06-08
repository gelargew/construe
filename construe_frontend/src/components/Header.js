import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { baseUrl, userContext } from './App';



export const Header = () => {
    const {user, setUser} = useContext(userContext)
    const history = useHistory()

    const logoutUser = async () => {
        const response = await fetch(`${baseUrl}/auth/logout/`)
        if (response.status === 200) {
            const data = await response.json()
            setUser(data)
            history.push('/')
        }
    }

    return (
        <div className='header'>
            <Link to='/'>Home</Link>
            <div className='header-auth'>
                {user.is_authenticated 
                ? 
                <>
                    {user.is_staff && <a href={`${baseUrl}/admin/books/book/`}>Administrator</a>}
                    <Link to='/contracts'>{user.is_staff ? 'Contracts' : 'My books'}</Link>
                    <a onClick={logoutUser}>Logout</a>
                </>
                :
                <>
                    
                    <Link to='/login'>Login</Link>
                    <Link to='/Register'>Register</Link>
                </>
            }
                <p className='username'>{user.username}</p>
            </div>
            
        </div>
    )
}