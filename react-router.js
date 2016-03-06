import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { render } from 'react-dom';

import { App, Load, Inspect, Plot } from './Menu.js';

render(
    <Router history={hashHistory} >
        <Route path='/' component={App}>
            <Route path='/load' component={Load} />
            <Route path='/inspect' component={Inspect} />
            <Route path='/plot' component={Plot} />
        </Route>
    </Router>,
    document.getElementById('example')
);
