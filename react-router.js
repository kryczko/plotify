import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import { render } from 'react-dom';

import {App, Load, Inspect, Plot} from './Menu.js';

render(
    <Router history={hashHistory} >
        <Route path="/" component={App}></Route>
    </Router>,
    document.getElementById('example')
);