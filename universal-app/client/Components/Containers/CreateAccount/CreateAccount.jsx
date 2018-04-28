import { Link, Redirect } from 'react-router-dom';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Preloader from '../../Presentations/Preloader/Preloader.jsx';
import { registerAccount } from '../../../Management/Actions/UserActions.jsx';

/* global $ */

class CreateAccount extends React.Component {
    constructor() {
        super();
        
        this.state = {
            redirectToLogin: false
        };
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
                
                this.props.registerAccount(inputs, () => {
                    this.setState({
                        redirectToLogin: true
                    });
                });
            }
        });
        
        this.validator = $("#account-form").validate({
            rules: {
                'account-username': {
                    required: true
                },
                'account-email': {
                    required: true,
                    email: true
                },
                'account-password': {
                    required: true
                },
                'confirm-account-password': {
                    required: true,
                    equalTo: '#account-password'
                }
            },
            messages: {
                'account-username': 'Username is required',
                'account-email': 'Valid email is required',
                'account-password': 'Password is required',
                'confirm-account-password': 'Passwords must match'
            }
        });
    }
    
    componentDidMount() {
        this.initializeValidation();
    }
    
    componentDidUpdate() {
        this.initializeValidation();
    }
    
    render() {
        if (this.props.loading)
            return <Preloader/>;
        
        if (this.state.redirectToLogin) {
            return <Redirect to={{
                pathname: "/login",
                state: "Account successfully created!"
            }}/>;
        }
        
        return (
            <div id="CreateAccount">
                <aside>
                </aside>
                <main>
                    <form id="account-form" onSubmit={(e) => { e.preventDefault() }}>
                        <h1>Registration</h1>
                        <div className="form-row">
                            <label htmlFor="account-username">USERNAME: </label>
                            <input type="text" id="account-username" name="account-username" placeholder="..."/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="account-email">EMAIL: </label>
                            <input type="text" id="account-email" name="account-email" placeholder="..."/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="account-password">PASSWORD: </label>
                            <input type="password" id="account-password" name="account-password" placeholder="..."/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="confirm-account-password">CONFIRM: </label>
                            <input type="password" id="confirm-account-password" name="confirm-account-password" placeholder="..."/>
                        </div>
                        <div className="btn-block">
                            <button type="button" className="btn-danger rm-btn-padding"><Link to="/login" className="add-btn-padding">CANCEL</Link></button>
                            <button type="submit" className="btn-success">REGISTER</button>
                        </div>
                    </form>
                </main>
                <aside>
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
        registerAccount
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);