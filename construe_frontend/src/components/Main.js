import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginPage } from './Auth';
import { Home } from './Home';
import { userContext } from './App'
import { BookPage } from './BookPage'
import { ContractPage } from './ContractPage';


export function Main() {
    const {user, setUser} = useContext(userContext)
    function handle(e) {
        setUser(prev => {return {...prev, name: e.target.value}})
    }
    return (
        <main>
            <h1>{user.name}</h1>
            <input type='text' onChange={handle} />
            <Switch>
                <Route path='/login'>
                    <LoginPage />
                </Route>

                <Route path='/book/:id'>
                    <BookPage />
                </Route>

                <Route path='/contracts'>
                    <ContractPage />
                </Route>

                <Route path='/'>
                    <Home />
                </Route>
            </Switch>
        </main>
    )
}