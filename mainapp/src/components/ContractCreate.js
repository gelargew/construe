import React, { useEffect, useState } from 'react'


export function CreateContract() {
    const [users, setUsers] = useState([])
    const [books, setBooks] = useState([])
    const [reloadUsers, setReloadUsers] = useState('')
    const [reloadBooks, setReloadBooks] = useState('')
    const [alertBox, setAlertBox] = useState('')

    useEffect(async () => {
        const response = await fetch(`auth/list/${reloadUsers}`)
        const data = await response.json()
        setUsers(Object.values(data))

    }, [reloadUsers])

    useEffect(async () => {
        const response = await fetch(`api/books/${reloadBooks}`)
        const data = await response.json()
        setBooks(data)
    }, [reloadBooks])

    const sendForm = async e => {
        e.preventDefault()
        setAlertBox('')
        const data = {
            book_id: document.querySelector('#contract-book-list').value.split('/id:').pop(),
            user_id: document.querySelector('#contract-user-list').value.split('/id:').pop(),
            duration: document.querySelector('#contract-duration').value.charAt(0)
        }
        const response = await fetch('api/contract/create/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(data)       
        })
        if (response.status > 399) {
            console.log('eerror')
            setAlertBox('Ups, something went wrong. Please try again.') 
        }
        else setAlertBox('success')
    }

    return (
        <div>
            <form onSubmit={sendForm}>
                <label>
                    User: a
                    <input id='contract-user-list' list='contract-user-list-data' 
                    onChange={e => setReloadUsers(e.target.value)} />
                    <datalist id='contract-user-list-data'>
                        {users.map(user => {
                            return <option value={user.username + '/id:' + user.id} user-id={user.id}>{user.email}</option>
                        })}
                    </datalist>
                </label>

                <label name='booklist'>
                    Book: 
                    <input list='contract-book-list-data' id='contract-book-list'
                    onChange={e => setReloadBooks(e.target.value)} />
                    <datalist id='contract-book-list-data' >
                        {books.map(book => {
                            return <option value={book.title + '/id:' + book.id}>{book.author}</option>
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
                {alertBox && <p>{alertBox}</p>}
            </form>
        </div>
    )
}