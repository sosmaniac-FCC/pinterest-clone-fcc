import { Link, Redirect } from 'react-router-dom';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Preloader from '../../Presentations/Preloader/Preloader.jsx';
import { loginAccount } from '../../../Management/Actions/UserActions.jsx';

/* global $ */

class LoginPage extends React.Component {
    constructor(props) {
        super();
        
        this.state = {
            redirectToRecent: false  
        };
        
        this.twitterAuth = this.twitterAuth.bind(this);
    }
    
    initializeValidation() {
        $.validator.setDefaults({
            errorClass: 'invalid',
            validClass: "valid",
            submitHandler: (form) => {
                const elements = form.getElementsByTagName("input");
                let inputs = {};
                
                for (let i = 0; i < elements.length; i++) {
                    inputs[elements[i].id] = elements[i].value;
                }
                
                this.props.loginAccount(inputs, () => {
                    this.setState({
                        redirectToRecent: true      
                    });
                });
            }
        });
        
        this.validator = $("#login-form").validate({
            rules: {
                'login-username': {
                    required: true
                },
                'login-password': {
                    required: true
                }
            },
            messages: {
                'login-username': "Username is required",
                'login-password': "Password is required"
            }
        });
    }
    
    componentDidMount() {
        this.initializeValidation();
    }
    
    componentDidUpdate() {
        this.initializeValidation();
    }
    
    twitterAuth() {
        // oauth redirect to twitter.com
        window.location.href = '/twitter/auth';
    }
    
    render() {
        if (this.props.loading)
            return <Preloader/>;
        
        if (this.state.redirectToRecent) 
            return <Redirect to="/pins-all"/>;
        
        return (
            <div id="LoginPage">
                <aside>
                    <i className="fa fa-tree"></i>
                </aside>
                <form id="login-form" onSubmit={(e) => { e.preventDefault(); }}>
                    <h1>{this.props.location.state ? this.props.location.state : "Login"}</h1>
                    <div className="form-row">
                        <label htmlFor="login-username">USERNAME: </label>
                        <input type="text" id="login-username" name="login-username" placeholder="..."/>
                    </div>
                    <br/>
                    <div className="form-row">
                        <label htmlFor="login-password">PASSWORD: </label>
                        <input type="password" id="login-password" name="login-password" placeholder="..."/>
                    </div>
                    <br/>
                    <button type="submit" className="btn-success">LOGIN</button>
                    <button type="button" className="btn-primary" onClick={this.twitterAuth}>
                        <span className="fab fa-twitter"></span> Login with Twitter
                    </button> 
                    <Link to="/create-account">Register New Account</Link>
                </form>
                <aside>
                    <i className="fab fa-pagelines"></i>
                </aside>
            </div>
        );
    }
}

function mapStateToProps({ users }) {
    return {
        loading: users.loading  
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginAccount
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);