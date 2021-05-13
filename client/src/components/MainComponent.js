import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPageComponent from './LandingPageComponent'
import Header from './NavbarComponent'
import ScrollToTop from './ScrollToTop'
import SlotsComponent from './SlotsComponent'

function Main() {
    return (
        <div>
        <BrowserRouter>
        <Header />
        <Switch>
            <Route exact path='/' component={LandingPageComponent} />
            <Route path="/slots" component={SlotsComponent} />
        </Switch>
        <ScrollToTop />
        </BrowserRouter>
        </div>
    )
}

export default Main
