import axios from 'axios';
import imagesLoaded from 'imagesloaded';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Preloader from '../../Presentations/Preloader/Preloader.jsx';
import PinModal from '../../Presentations/PinModal/PinModal.jsx';
import PinSpread from '../../Presentations/PinSpread/PinSpread.jsx';
import { getPinData, cleanData, postPin, removePin } from '../../../Management/Actions/PinActions.jsx';

/* global $ */

class UserPins extends React.Component {
    constructor() {
        super();
        
        this.ignorePreloader = false;
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleModalToggle = this.handleModalToggle.bind(this);
    }
    
    handleSubmit(inputs) {
        const modal = document.getElementById("PinModal");
        modal.style.visibility = "hidden";
        modal.style.opacity = "0";
        
        const modalContent = document.querySelector("#PinModal section");
        Object.assign(modalContent.style, {
            animationName: 'shiftOut',
            animationFillMode: 'forwards',
            animationDuration: '0s'
        });
        
        this.ignorePreloader = true;
        this.props.postPin({ ...inputs, userId: this.props.userId }, (newPin) => {
            if (newPin) {
                const element = document.createElement('section');
                element.setAttribute('id', newPin._id);
                
                const img = document.createElement('img');
                img.setAttribute('src', newPin.imgURL);
                img.addEventListener('error', () => {
                    img.setAttribute('src', '/assets/default.jpeg');
                });
                
                const pOne = document.createElement('p');
                pOne.innerHTML = newPin.title;
                
                const i = document.createElement('i');
                i.setAttribute('data-id', newPin._id);
                i.setAttribute('class', 'fas fa-times icon-delete');
                i.addEventListener('click', this.handleRemove);
                
                const pTwo = document.createElement('p');
                pTwo.innerHTML = `${newPin.likes} likes`;
                
                element.appendChild(img);
                element.appendChild(pOne);
                element.appendChild(i);
                element.appendChild(pTwo);
                
                $(element).appendTo('#PinSpread');
                $("#PinSpread").masonry('appended', element);
                
                $(document).ready(() => {
                    $("#PinSpread section img").imagesLoaded().always(() => {
                        $("#PinSpread").masonry('layout');
                    });
                });
            }
        });
    }
    
    handleRemove(event) {
        const element = event.target;
        
        this.props.removePin(element.getAttribute('data-id'), (success) => {
            // unicode exception
            let id = element.getAttribute('data-id');
            if (typeof +id.substring(0,1) == 'number' && !isNaN(id.substring(0, 1)))
                id = `\\3${id.substring(0, 1)} ${id.substring(1)}`;
            
            if (success) {
                $(`#${id}`).remove();
                $("#PinSpread").masonry('layout');
            }
        });
    }
    
    handleModalToggle() {
        const modal = document.getElementById("PinModal");
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
        
        const modalContent = document.querySelector("#PinModal section");
        Object.assign(modalContent.style, {
            animationName: 'shiftIn',
            animationFillMode: 'forwards',
            animationDuration: '0.4s',
            animationTimingFunction: 'ease-in-out'
        });
    }
    
    static requestInitialData(state) {
        // results in a server-side dispatch populated with the necessary initialData
        if (state.users.userId) {
            return axios.get(`${process.env.APP_URL}/fetchPins?id=${state.users.userId}`)
                .then((response) => ({ type: "UPLOAD_PIN_DATA", data: response.data }));
        }
        else {
            return null;
        }
    }
    
    fetchData() {
        if (!this.props.pins)
            this.props.getPinData(this.props.userId);
    }
    
    componentWillUnmount() {
        this.props.cleanData();
    }
    
    componentDidMount() {
        // clicking anywhere outside of the modal closes it
        window.addEventListener('click', (event) => {
            const modal = document.getElementById("PinModal");
            const modalContent = document.querySelector("#PinModal section");
            
            if (event.target == modal || event.target == modalContent) {
                modal.style.visibility = "hidden";
                modal.style.opacity = "0";
                
                Object.assign(modalContent.style, {
                    animationName: 'shiftOut',
                    animationFillMode: 'forwards',
                    animationDuration: '0s'
                });
            }
        });
        
        this.fetchData();
    }
    
    componentDidUpdate() {
        this.fetchData();
    }
    
    render() {
        if (this.props.loading && !this.ignorePreloader) 
            return <Preloader/>;
        
        return (
            <div id="UserPins">
                <header>
                    <h3>{this.props.userId}'s Pins</h3>
                    <button className="btn-block btn-success" onClick={this.handleModalToggle}>CREATE NEW PIN</button>
                    <PinModal submit={this.handleSubmit}/>
                </header>
                <hr/>
                <main>
                    { !this.props.pins || this.props.pins.length === 0 ? <p className="empty-message">You have not created any pins yet!</p> : <PinSpread pins={this.props.pins} remove={this.handleRemove} type="owner"/> }
                </main>
            </div>
        );
    }
}

function mapStateToProps(store) {
    return {
        userId: store.users.userId,
        loading: store.pins.loading,
        pins: store.pins.pinData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        cleanData,
        getPinData,
        postPin,
        removePin
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPins);