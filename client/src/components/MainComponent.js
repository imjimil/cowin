import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import LandingPageComponent from './LandingPageComponent'

function Main() {
    return (
        <BrowserRouter>
            <Route path='/' component={LandingPageComponent} />
        </BrowserRouter>
    )
}

export default Main
