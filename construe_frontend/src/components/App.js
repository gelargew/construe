import React, { createContext, useState } from 'react'
import { render } from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Content } from './Content';
import { Header } from './Header';
import { Main } from './Main';
import { Sidebar } from './Sidebar';


export const userContext = createContext()
export const baseUrl = window.location.origin


function App() {
    const [user, setUser] = useState({ name: 'guest', is_staff: true})

    return (
        <userContext.Provider value={{user, setUser}}>
          <Router>
            <Header />
            <Sidebar />
            <Main />
          </Router>
        </userContext.Provider>
       
      );
    }
    
  

render(<App />, document.querySelector('.root'))
