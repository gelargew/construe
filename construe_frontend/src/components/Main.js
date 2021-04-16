import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Login } from './Auth';
import { Home } from './Home';


export function Main() {
    return (
        <div>
            <h1>Main</h1>
            <Switch>
                <Route path='/login'>
                    <Login />
                </Route>

                <Route path='/'>
                    <Home />
                </Route>
            </Switch>
        </div>
    )
}