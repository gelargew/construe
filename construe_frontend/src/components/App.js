import React, { createContext, useEffect, useState } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import { Header } from './Header';
import { Main } from './Main';
import { Sidebar } from './Sidebar';


export const userContext = createContext()
export const baseUrl = window.location.origin


const App = () => {
    const [user, setUser] = useState('')

    useEffect(async () => {
      const response = await fetch(baseUrl + '/auth/current_user/')
      const data = await response.json()
      setUser(data)
    }, [])

    return (
        <userContext.Provider value={{user, setUser}}>
          <BrowserRouter>
            <Header />
            <Sidebar />
            <Main />
          </BrowserRouter>
        </userContext.Provider>
       
      );
    }
    
  

render(<App />, document.querySelector('.root'))
