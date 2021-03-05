import React from 'react'
import { render } from 'react-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'

const App = () => {
    return (
    <>
        <Header />
        <Main />
        <Footer />
    </>
    )
}

render(<App />, document.querySelector('.root'))