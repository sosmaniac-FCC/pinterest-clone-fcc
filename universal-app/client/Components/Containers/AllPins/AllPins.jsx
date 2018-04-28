import axios from 'axios';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Preloader from '../../Presentations/Preloader/Preloader.jsx';
import PinSpread from '../../Presentations/PinSpread/PinSpread.jsx';
import { updatePinLikes, getPinData, cleanData } from '../../../Management/Actions/PinActions.jsx';

/* global $ */

class AllPins extends React.Component {
    constructor() {
        super();
        
        this.handleUpvote = this.handleUpvote.bind(this);
    }
    
    handleUpvote(event) {
        const element = event.target;
        
        this.props.updatePinLikes({ pinId: element.getAttribute('data-id'), userId: this.props.userId }, (toIncrement) => {
            // unicode exception
            let id = element.getAttribute('data-id');
            if (typeof +id.substring(0,1) == 'number' && !isNaN(id.substring(0, 1)))
                id = `\\3${id.substring(0, 1)} ${id.substring(1)}`;
                
            const likesElement = document.querySelector(`#${id} span`);
            
            if (typeof toIncrement == 'boolean') {
                if (toIncrement)
                    likesElement.innerHTML = (+likesElement.innerHTML) + 1; 
                else 
                    likesElement.innerHTML = (+likesElement.innerHTML) - 1;
            }
        });
    }
    
    static requestInitialData(state) {
        return axios.get(`${process.env.APP_URL}/fetchPins`)
            .then((response) => ({ type: "UPLOAD_PIN_DATA", data: response.data }));
    }
    
    fetchData() {
        if (!this.props.pins)
            this.props.getPinData(null);
    }
    
    componentWillUnmount() {
        this.props.cleanData();
    }
    
    componentDidMount() {
        this.fetchData();
    }
    
    componentDidUpdate() {
        this.fetchData();
    }
    
    render() {
        if (this.props.loading)
            return <Preloader/>;
        
        return (
            <div id="AllPins">
                <main>
                    <PinSpread pins={this.props.pins} upvote={this.handleUpvote} type="user"/>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state.users.userId,
        loading: state.pins.loading,
        pins: state.pins.pinData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        cleanData,
        getPinData,
        updatePinLikes
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPins);