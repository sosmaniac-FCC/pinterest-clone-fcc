import axios from 'axios';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PinSpread from '../../Presentations/PinSpread/PinSpread.jsx';
import Preloader from '../../Presentations/Preloader/Preloader.jsx';
import { getPinData, cleanData } from '../../../Management/Actions/PinActions.jsx';

/* global $ */

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.images = [
            '/assets/nature-forest-trees-fog.jpeg', 
            '/assets/nature-desert-perculiar-tree.jpeg', 
            '/assets/nature-mountain-himalayas.jpeg', 
            '/assets/nature-forest-leaves-bed.jpeg', 
            '/assets/nature-ocean-rocky-bay.jpeg'
        ];
        this.messages = [
            'Natural forest-scape permeated by an atmospheric fog...',
            'Rugged desert showing signs of plant life despite the rocky geography...',
            'Soaring mountain range that only select few have ever been able to scale...',
            'Bed of forest leaves with small droplets of water indicating recent rainfall...',
            'Remote ocean bay bordered by pitch black, basaltic outcrops...'
        ];
        
        
        this.state = {
            imgIndex: 0,
            msgIndex: 0
        };
    }
    
    static requestInitialData(state) {
        return axios.get(`${process.env.APP_URL}/fetchPins`)
            .then((response) => ({ type: "UPLOAD_PIN_DATA", data: response.data }));
    }
    
    fetchData() {
        if (!this.props.pins)
            this.props.getPinData(null);
    }
    
    initializeCarousel() {
        window.addEventListener('resize', () => {
            document.getElementById("index-image-scroll").width = $("#NavBar").width();
        });
        
        this.timerId = setInterval(() => {
            document.getElementById("index-image-scroll").style.opacity = 0;
            this.setState((prevState) => ({
                msgIndex: (prevState.msgIndex + 1) < this.images.length ? (prevState.msgIndex + 1) : 0
            }));
            
            this.timeoutId = setTimeout(() => {
                this.setState((prevState) => ({
                    imgIndex: (prevState.imgIndex + 1) < this.images.length ? (prevState.imgIndex + 1) : 0
                }));
            }, 750);
        }, 9000);
    }
    
    componentWillUnmount() {
        clearInterval(this.timerId);
        clearTimeout(this.timeoutId);
        this.props.cleanData();
    }
    
    componentDidUpdate() {
        this.fetchData();
        
        if (document.getElementById("index-image-scroll"))
            document.getElementById("index-image-scroll").width = $("#NavBar").width();
    }
    
    componentDidMount() {
        this.fetchData();
        
        document.getElementById("index-image-scroll").style.opacity = 1;
        document.getElementById("index-image-scroll").width = $("#NavBar").width();
        
        this.initializeCarousel();
    }
    
    render() {
        if (this.props.loading) 
            return <Preloader/>;
        
        return (
            <div id="IndexPage">
                <main>
                    <img id="index-image-scroll" width={0} src={this.images[this.state.imgIndex]} alt={`INDEX_IMAGE_${this.state.imgIndex}`} onLoad={(event) => { event.target.style.opacity = 1; }}/>
                    <figcaption>{this.messages[this.state.msgIndex]}</figcaption>
                </main>
                <div className="sub-grid">
                    <div className="grid-item-a info-main">
                        <div>
                            <h3 className="fa fa-leaf"></h3>
                            <h3 className="fa fa-paw"></h3>
                        </div>
                        <div>
                            <p>Lorem ipsum dolor sit amet, sea everti nostrud diceret cu, ne wisi liberavisse sed. Vel no minimum salutatus. 
                            Eum ei illud soluta recusabo, posse movet latine ius cu, detracto laboramus theophrastus qui in. Ex has putent 
                            sanctus, eos id posse oblique moderatius. Case adversarium ad vim, in sanctus ornatus invidunt sea, no oblique 
                            scripserit ius.</p>
                        </div>
                    </div>
                    <div className="grid-item-b info-main">
                        <div>
                            <h3 className="fa fa-globe"></h3>
                            <h3 className="fa fa-user"></h3>
                        </div>
                        <div>
                            <p>Lorem ipsum dolor sit amet, sea everti nostrud diceret cu, ne wisi liberavisse sed. Vel no minimum salutatus. 
                            Eum ei illud soluta recusabo, posse movet latine ius cu, detracto laboramus theophrastus qui in. Ex has putent 
                            sanctus, eos id posse oblique moderatius. Case adversarium ad vim, in sanctus ornatus invidunt sea, no oblique 
                            scripserit ius.</p>
                        </div>
                    </div>
                    <div className="grid-item-ab info-spread">
                        <p className="spread-header">CURRENT PINS</p>
                        <PinSpread pins={this.props.pins} type="viewer"/>
                    </div>
                    <div className="grid-item-ab info-footer">
                        <p>Carousel images sourced from <a href="https://www.pexels.com/search/nature/">www.pexels.com</a>.</p>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ pins }) {
    return {
        loading: pins.loading,
        pins: pins.pinData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        cleanData,
        getPinData
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);