import React, { useEffect, useState } from 'react'


export function CreateContract({ books }) {
    const [users, setUsers] = useState([])
    const [reloadUsers, setReloadUsers] = useState('')

    useEffect(async () => {
        const response = await fetch(`auth/list/${reloadUsers}`)
        const data = await response.json()
        setUsers(Object.values(data))

    }, [reloadUsers])

    const handleReloadUsers = (e) => setReloadUsers(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            book_id: document.querySelector('#contract-book-list').value.split('/').pop(),
            user_id: document.querySelector('#contract-user-list').value.split('/').pop(),
            duration: document.querySelector('#contract-duration').value.charAt(0)
        }
        console.log(JSON.stringify(data))
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    User: 
                    <input id='contract-user-list' list='contract-user-list-data' onChange={handleReloadUsers} />
                    <datalist id='contract-user-list-data'>
                        {users.map(user => {
                            return <option value={user.username + '/' + user.id} user-id={user.id}>{user.email}</option>
                        })}
                    </datalist>
                </label>
                <label name='booklist'>
                    Book: 
                    <input list='contract-book-list-data' id='contract-book-list' />
                    <datalist id='contract-book-list-data' >
                        {books.map(book => {
                            return <option value={book.title + '/' + book.id}>{book.author}</option>
                        })}
                    </datalist>
                </label>
                <label>
                    duration:
                    <input list='contract-duration-data' id='contract-duration' />
                    <datalist id='contract-duration-data'>
                        <option value='1 week'>1 week</option>
                        <option value='2 weeks'>2 weeks</option>
                        <option value='3 weeks'>3 weeks</option>
                        <option value='4 weeks'>4 weeks</option>
                    </datalist>
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}