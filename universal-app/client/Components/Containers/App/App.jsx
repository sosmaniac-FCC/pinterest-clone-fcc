import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { cleanPinMsgs } from '../../../Management/Actions/PinActions.jsx';
import { cleanUserMsgs } from '../../../Management/Actions/UserActions.jsx';

import NavBar from '../NavBar/NavBar.jsx';
import RoutesComponent from '../../../../server/routes/RoutesComponent.jsx';

/* global $ */

class App extends React.Component {
    constructor() {
        super();
        
        this.reset = false;
    }
    
    componentDidUpdate() {
        if (this.reset) {
            this.reset = false;
            
            if (this.props.pinSuccess || this.props.pinFailure)
                this.props.cleanPinMsgs();
            else if (this.props.userSuccess || this.props.userFailure)
                this.props.cleanUserMsgs();
        }
        else if (this.props.userSuccess || this.props.userFailure || this.props.pinSuccess || this.props.pinFailure) {
            this.reset = true;
        }
    }
    
    render() {
        return (
            <div id="App">
                <NavBar/>
                <RoutesComponent/>
                <h6>Coded by John Simmons</h6>
            </div>    
        );
    }
}

function mapStateToProps(state) {
    return {
        pinSuccess: state.pins.successMsg,
        pinFailure: state.pins.failureMsg,
        userSuccess: state.users.successMsg,
        userFailure: state.users.failureMsg
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        cleanPinMsgs,
        cleanUserMsgs
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));