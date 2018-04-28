import React from 'react';

/* global $ */

// NOTICE: 
// May need to manually reset validator and input-fields between multiple pin submissions

class PinModal extends React.Component {
    constructor() {
        super();
        
        this.state = {
            activeImg: '/assets/default.jpeg'
        };
        
        this.handleImgUpdate = this.handleImgUpdate.bind(this);
        this.handleBrokenImg = this.handleBrokenImg.bind(this);
        this.handlePinSubmit = this.handlePinSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    
    componentDidMount() {
        $.validator.setDefaults({
            errorClass: 'invalid',
            validClass: "valid",
            submitHandler: (form) => {
                const elements = form.getElementsByTagName("input");
                let inputs = {};
                
                for (let i = 0; i < elements.length; i++) {
                    inputs[elements[i].id] = elements[i].value;
                    elements[i].value = "";
                }
                
                this.validator.resetForm();
                this.props.submit(inputs);
            }
        });
        
        this.validator = $("#pin-form").validate({
            rules: {
                'pin-title': {
                    required: true
                },
                'pin-url': {
                    required: true
                }
            },
            messages: {
                'pin-title': 'This field is required.',
                'pin-url': 'This field is required.'
            }
        });
    }
    
    componentWillUnmount() {
        this.validator.destroy();
    }
    
    handleImgUpdate(event) {
        this.setState({
            activeImg: event.target.value
        });
    }
    
    handleBrokenImg() {
        this.setState({
            activeImg: '/assets/default.jpeg'
        });
    }
    
    handlePinSubmit(event) {
        event.preventDefault();
    }
    
    handleCancel() {
        const modal = document.getElementById("PinModal");
        modal.style.visibility = "hidden";
        modal.style.opacity = "0";
        
        const modalContent = document.querySelector("#PinModal section");
        Object.assign(modalContent.style, {
            animationName: 'shiftOut',
            animationFillMode: 'forwards',
            animationDuration: '0s'
        });
    }
    
    render() {
        return (
            <div id="PinModal">
                <section>
                    <form onSubmit={this.handlePinSubmit} id="pin-form">
                        <h1>New Pin!</h1>
                        <img onError={this.handleBrokenImg} src={this.state.activeImg}/>
                        <div className="form-row">
                            <label htmlFor="pin-title">Title: </label>
                            <input type="text" id="pin-title" name="pin-title" placeholder="..."/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="pin-url">URL: </label>
                            <input onChange={this.handleImgUpdate} type="text" id="pin-url" name="pin-url" placeholder="..."/>
                        </div>
                        <div className="btn-block">
                            <button onClick={this.handleCancel} className="btn-danger" type="button">Cancel</button>
                            <button className="btn-success" type="submit">Create</button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

export default PinModal;