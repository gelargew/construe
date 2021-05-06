import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl, userContext } from './App';



export const Header = () => {
    const {user, setUser} = useContext(userContext)

    const logoutUser = async () => {
        const response = await fetch(`${baseUrl}/auth/logout/`)
        if (response.status === 200) {
            const data = await response.json()
            setUser(data)
        }
    }


    return (
        <div className='header'>
            <Link to='/'>Home</Link>
            <div className='header-auth'>
                {user.is_authenticated ? 
                <>
                    <Link to='/contracts'>contracts</Link>
                    <a onClick={logoutUser}>Logout</a>
                </>:
                <>
                    
                    <Link to='/login'>Login</Link>
                    <Link to='/Register'>Register</Link>
                    <a onClick={logoutUser}>Logout</a>
                </>
            }
                <p>{user.username}</p>
                <button onClick={() => console.log(user)}>USER</button>
            </div>
            
        </div>
    )
}