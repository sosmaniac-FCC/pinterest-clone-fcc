import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './Components/Containers/App/App.jsx';
import configureStore from './Management/configureStore.jsx';

/* global $ */

const store = configureStore(window.__initialData__);

console.log(store.getState());

$(document).ready(() => {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>, 
        document.getElementById('root')
    );
});