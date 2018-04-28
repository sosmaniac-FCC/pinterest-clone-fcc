import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import pins from './Reducers/PinReducer.jsx';
import users from './Reducers/UserReducer.jsx';

const reducers = combineReducers({
     pins,
     users
});

const configureStore = (preloadedState) => createStore(reducers, preloadedState, applyMiddleware(thunk, logger));

export default configureStore;