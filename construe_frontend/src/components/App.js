import React from 'react'
import { render } from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Content } from './Content';


function App() {
    return (
        <>
        <Router>
          <div>
          <nav>
                <Link to='/'>Home</Link>
                <Link to='/about'>About</Link>
                <Link to='/Users'>Users</Link>
            </nav>
    
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
        </>
      );
    }
    
    function Home() {
      return <h2>Home</h2>;
    }
    
    function About() {
      return <h2>About</h2>;
    }
    
    function Users() {
      return <h2>Users</h2>;
    }


render(<App />, document.querySelector('.root'))
