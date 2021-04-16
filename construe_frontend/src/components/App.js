import React from 'react'
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


function App() {
    return (
        <Router>
          <Header />
          <Sidebar />
          <Main />
        </Router>
       
      );
    }
    
  

render(<App />, document.querySelector('.root'))
