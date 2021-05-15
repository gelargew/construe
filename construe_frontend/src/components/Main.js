import React, { useContext } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { LoginPage, RegisterPage } from './Auth';
import { Home } from './Home';
import { userContext } from './App'
import { BookPage } from './BookPage'
import { ContractPage } from './ContractPage';
import { ContactUsPage, MessagePage } from './ContactUs';


export const Main = () => {
    const {user, setUser} = useContext(userContext)
 
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

        </main>
    )
}