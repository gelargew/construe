import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { LoginPage, RegisterPage } from './Auth';
import { Home } from './Home';
import { BookPage } from './BookPage'
import { ContractPage } from './ContractPage';
import { ContactUsPage, MessagePage } from './ContactUs';


export const Routes = () => {
 
    return (
        <main>
            <Switch>
                <Route path='/login'>
                    <LoginPage />
                </Route>

                <Route path='/register'>
                    <RegisterPage />
                </Route>

                <Route path='/book/:book_pk/:slug'>
                    <BookPage />
                </Route>

                <Route path='/contracts'>
                    <ContractPage />
                </Route>

                <Route path='/contact'>
                    <ContactUsPage />
                </Route>

                <Route path='/message/:message_pk'>
                    <MessagePage />
                </Route>

                <Route path='/'>
                    <Home />
                </Route>
            </Switch>
        
            <Link className='footer' to='/contact'>contact us</Link>

            <div className='bg-logo'><h1>c</h1><h1>T</h1></div>

        </main>
    )
}