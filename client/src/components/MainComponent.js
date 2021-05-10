import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import LandingPageComponent from './LandingPageComponent'
import SlotsComponent from './SlotsComponent'

function Main() {
    return (
        <BrowserRouter>
            <Route exact path='/' component={LandingPageComponent} />
            <Route path="/slots" component={SlotsComponent} />
        </BrowserRouter>
    )
}

export default Main
