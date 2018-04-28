import { Redirect, withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import routes from './routes.jsx';
import { Switch, Route } from 'react-router-dom';

class RoutesComponent extends React.Component { 
    constructor() {
        super();
    }
    
    protectedRoute(props, Component) {
        if (this.props.isAuthenticated) {
            return <Component {...props}/>;
        }
        else {
            return <Redirect to={{
                pathname: "/login",
                state: "You must login first!"
            }}/>;
        }
    }
    
    render() {
        return (
            <Switch>
                {routes.map((route, i) => {
                    if (!route.render) {
                        return <Route key={i} {...route}/>;
                    }
                    else {
                        return <Route key={i} exact={route.exact || false} path={route.path} render={(props) => this.protectedRoute(props, route.component)}/>;
                    }
                })}
            </Switch>
        );
    }
}

function mapStateToProps({ users }) {
    return {
        isAuthenticated: users.isAuthenticated
    };
}

export default withRouter(connect(mapStateToProps, null)(RoutesComponent));