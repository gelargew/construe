import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginPage } from './Auth';
import { Home } from './Home';
import { userContext } from './App'


export function Main() {
    const user = useContext(userContext)
    function handle(e) {
        user.setUser(prev => {return {...prev, name: e.target.value}})
        console.log(user)
    }
    return (
        <main>
            <h1>{user.user.name}</h1>
            <input type='text' onChange={handle} />
            <Switch>
                <Route path='/login'>
                    <LoginPage />
                </Route>

                <Route path='/'>
                    <Home />
                </Route>
            </Switch>
        </main>
    )
}