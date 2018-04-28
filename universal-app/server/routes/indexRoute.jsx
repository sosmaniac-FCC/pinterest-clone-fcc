import jwt from 'jsonwebtoken';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import routes from './routes.jsx';
import express from 'express';
import { StaticRouter, matchPath } from 'react-router-dom';
// JSON.stringify() is vulnerable to insertion attacks unlike serialize()
import serialize from 'serialize-javascript';

import App from '../../client/Components/Containers/App/App.jsx';
import config from '../server.config.js';
import configureStore from '../../client/Management/configureStore.jsx';

const router = express.Router();

router.get('*', (request, response) => {
    const store = configureStore();
    const activeRoute = routes.find(route => matchPath(request.url, route));
    
    // request.flash() empties the queue
    const successMsg = request.flash('success')[0]; 
    const errorMsg = request.flash('error')[0];
    
    if (request.user) 
        store.dispatch({ type: "LOGIN_ACCOUNT_SUCCESS", message: "", userId: request.user.username, token: jwt.sign(request.user.toJSON(), config.jwt.secret) });
    if (successMsg)
        store.dispatch({ type: "ACCOUNT_SUCCESS_MESSAGE", message: successMsg });
    else if (errorMsg)
        store.dispatch({ type: "ACCOUNT_FAILURE_MESSAGE", message: errorMsg });
        
    // static requestInitialData() function grabs the data necessary to render its host component (if it exists)
    // const requestInitialData = activeRoute ? activeRoute.component.requestInitialData && store.dispatch(activeRoute.component.requestInitialData()) : {};
    const requestInitialData = activeRoute.component.requestInitialData && activeRoute.component.requestInitialData(store.getState());
    
    Promise.resolve(requestInitialData)
    .then((initialAction) => {
        const context = {};
        
        initialAction && store.dispatch(initialAction);
        
        const application = renderToString(
            <Provider store={store}>
                <StaticRouter location={request.url} context={context}>
                    <App/>
                </StaticRouter>
            </Provider>
        );
        
        const initialData = store.getState();
        
        response.send(`
            <!DOCTYPE html> 
                <head>
                    <title>Nature!</title>
                    <meta charSet="utf-8"/>
                	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                	<link rel="stylesheet" href="/bundles/cssBundle.css"/>
                	<link rel="stylesheet" href="/libraries/fontawesome/css/fontawesome-all.css"/>
                	<script>window.__initialData__ = ${serialize(initialData)}</script>
                </head>
                <body>
                    <div id="root">${application}</div>
                    <script src="/libraries/jquery.min.js"></script>
                    <script src="/libraries/jquery.validate.min.js"></script>
                    <script src="/libraries/masonry.min.js"></script>
                    <script src="/bundles/jsBundle.js"></script>
                </body>
            </html>
        `);
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;