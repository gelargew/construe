import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginPage } from './Auth';
import { Home } from './Home';
import { userContext } from './App'
import { BookPage } from './BookPage'
import { ContractPage } from './ContractPage';


export function Main() {
    const {user, setUser} = useContext(userContext)
 
    return (
        <main>
            <Switch>
                <Route path='/login'>
                    <LoginPage />
                </Route>

                <Route path='/book/:pk/:slug'>
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