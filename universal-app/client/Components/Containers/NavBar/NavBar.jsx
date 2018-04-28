import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Alert from '../../Presentations/Alert/Alert.jsx';
import { logoutAccount } from '../../../Management/Actions/UserActions.jsx';

/* global $ */

class NavBar extends React.Component {
    constructor() {
        super();
        
        this.handleClick = this.handleClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    
    handleClick(event) {
        $(".active-nav-option") && $(".active-nav-option").removeClass("active-nav-option");
        $(event.currentTarget).addClass("active-nav-option");
    }
    
    handleLogout() {
        $(".active-nav-option") && $(".active-nav-option").removeClass("active-nav-option");
        $("#NavBar ul li:nth-child(1) > a").addClass("active-nav-option");
        
        this.props.logoutAccount();
    }
    
    determineNav() {
        const path = window.location.pathname.substring(1, (window.location.pathname.substring(1).indexOf('/') + 1) || window.location.pathname.length);
        $(".active-nav-option") && $(".active-nav-option").removeClass("active-nav-option");
        
        switch (path) {
            case '': {
                if (!this.props.userId)
                    $("#NavBar ul li:nth-child(1) > a").addClass("active-nav-option");
            } break;
            case 'login': {
                if (!this.props.userId)
                    $("#NavBar ul li:nth-child(2) > a").addClass("active-nav-option");
            } break;
            case 'create-account': {
                if (!this.props.userId)
                    $("#NavBar ul li:nth-child(2) > a").addClass("active-nav-option");
            } break;
            case 'pins-all': {
                $("#NavBar ul li:nth-child(1) > a").addClass("active-nav-option");
            } break;
            case 'pins': {
                $("#NavBar ul li:nth-child(2) > a").addClass("active-nav-option");
            } break;
            default: {
                // 404: component NotFound
            }
        }
    }
    
    componentDidMount() {
        this.determineNav();
    }
    
    componentDidUpdate() {
        this.determineNav();
    }
    
    render() {
        return (
            <div>
                <div id="NavBar">
                    <ul>
                        { this.props.isAuthenticated ? 
                            <li><Link to="/pins-all" onClick={this.handleClick}>Recent Pins</Link></li> :
                            <li><Link to="/" onClick={this.handleClick}>Main</Link></li> }
                            
                        { this.props.isAuthenticated ? 
                            <li><Link to={`/pins/${this.props.userId}`} onClick={this.handleClick}>Your Pins</Link></li> : null }
                            
                        { this.props.isAuthenticated ? 
                            <li><Link to="/" onClick={this.handleLogout}>Logout</Link></li> : 
                            <li><Link to="/login" onClick={this.handleClick}>Login</Link></li> }
                    </ul>
                    
                    <nav className="dropdown">
                        <mark>
                            <i className="fas fa-list"></i>
                        </mark>
                        <div className="dropdown-content">
                            { this.props.isAuthenticated ? 
                                <Link to="/pins-all" onClick={this.handleClick}>Recent Pins</Link> :
                                <Link to="/" onClick={this.handleClick}>Main</Link> }
                                
                            { this.props.isAuthenticated ? 
                                <Link to={`/pins/${this.props.userId}`} onClick={this.handleClick}>Your Pins</Link> : null }
                                
                            { this.props.isAuthenticated ? 
                                <Link to="/" onClick={this.handleLogout}>Logout</Link> : 
                                <Link to="/login" onClick={this.handleClick}>Login</Link> }
                        </div>
                    </nav>
                    <p id="app-title">Naturalist App</p>
                </div>
                { this.props.userSuccess ? <Alert message={this.props.userSuccess} type="notification-success"/> : null }
                { this.props.userFailure ? <Alert message={this.props.userFailure} type="notification-danger"/> : null }
                { this.props.pinSuccess ? <Alert message={this.props.pinSuccess} type="notification-success"/> : null }
                { this.props.pinFailure ? <Alert message={this.props.pinFailure} type="notification-danger"/> : null }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state.users.userId,
        isAuthenticated: state.users.isAuthenticated,
        pinSuccess: state.pins.successMsg,
        pinFailure: state.pins.failureMsg,
        userSuccess: state.users.successMsg,
        userFailure: state.users.failureMsg,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logoutAccount
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));