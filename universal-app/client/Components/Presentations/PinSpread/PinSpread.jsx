import imagesLoaded from 'imagesloaded';
import React from 'react';
import { v4 } from 'uuid';

/* global $ */

class PinSpread extends React.Component {
    constructor() {
        super();
        
        this.handleBrokenImg = this.handleBrokenImg.bind(this);
    }
    
    handleBrokenImg(event) {
        event.target.src = '/assets/default.jpeg';
    }
    
    renderToMasonry() {
        if (this.props.pins) {
            switch (this.props.type) {
                case 'owner': {
                    let element, img, pOne, pTwo, i;
                    
                    this.props.pins.forEach((pin) => {
                        element = document.createElement('section');
                        element.setAttribute('id', pin._id);
                        
                        img = document.createElement('img');
                        img.setAttribute('src', pin.imgURL);
                        img.setAttribute('alt', `ENTRY_IMAGE_${pin.title}`);
                        img.addEventListener('error', this.handleBrokenImg);
                        
                        pOne = document.createElement('p');
                        pOne.innerHTML = pin.title;
                        
                        i = document.createElement('i');
                        i.setAttribute('data-id', pin._id);
                        i.setAttribute('class', 'fas fa-times icon-delete');
                        i.addEventListener('click', this.props.remove);
                        
                        pTwo = document.createElement('p');
                        pTwo.innerHTML = `${pin.likes} likes`;
                        
                        element.appendChild(img);
                        element.appendChild(pOne);
                        element.appendChild(i);
                        element.appendChild(pTwo);
                        
                        $(element).appendTo('#PinSpread');
                        $("#PinSpread").masonry('appended', element); 
                    });
                } break;
                case 'user': {
                    let element, img, p, span, iOne, iTwo, a;
                    
                    this.props.pins.forEach((pin) => {
                        element = document.createElement('section');
                        element.setAttribute('id', pin._id);
                        
                        img = document.createElement('img');
                        img.setAttribute('src', pin.imgURL);
                        img.setAttribute('alt', `ENTRY_IMAGE_${pin.title}`);
                        img.addEventListener('error', this.handleBrokenImg);
                        
                        p = document.createElement('p');
                        p.innerHTML = pin.title;
                        
                        span = document.createElement('span');
                        span.innerHTML = pin.likes;
                        
                        iOne = document.createElement('i');
                        iOne.setAttribute('data-id', pin._id);
                        iOne.setAttribute('class', 'fas fa-heart icon-primary');
                        iOne.addEventListener('click', this.props.upvote);
                        
                        iTwo = document.createElement('i');
                        iTwo.setAttribute('class', 'fas fa-retweet icon-twitter');
                        
                        a = document.createElement('a');
                        a.setAttribute('target', 'blank');
                        a.setAttribute('href', `https://twitter.com/intent/tweet?text=${pin.title}&url=${process.env.APP_URL}&via=FCC-Naturalist`);
                        a.appendChild(iTwo);
                        
                        element.appendChild(img);
                        element.appendChild(p);
                        element.appendChild(span);
                        element.appendChild(iOne);
                        element.appendChild(a);
                        
                        $(element).appendTo('#PinSpread');
                        $("#PinSpread").masonry('appended', element); 
                    });
                } break;
                case 'viewer': {
                    let element, img, p;
                    
                    this.props.pins.forEach((pin) => {
                        element = document.createElement('section');
                        element.setAttribute('id', pin._id);
                        
                        img = document.createElement('img');
                        img.setAttribute('src', pin.imgURL);
                        img.setAttribute('alt', `ENTRY_IMAGE_${pin.title}`);
                        img.addEventListener('error', this.handleBrokenImg);
                        
                        p = document.createElement('p');
                        p.innerHTML = pin.title;
                        
                        element.appendChild(img);
                        element.appendChild(p);
                        
                        $(element).appendTo('#PinSpread');
                        $("#PinSpread").masonry('appended', element); 
                    });
                } break;
                default: null;
            }
            
            $(document).ready(() => {
                // first call for non-error images
                $("#PinSpread section img").imagesLoaded().always(() => {
                    // second call for error defaults
                    $("#PinSpread section img").imagesLoaded().always(() => {
                        $("#PinSpread").masonry('layout');
                    });
                });
            });
        }
    }
    
    componentDidMount() {
        if (document.readyState == "interactive") {
            $(window).on('load', () => {
                $(document).ready(() => {
                    $("#PinSpread").masonry({
                        columnWidth: 'section',
                        itemSelector: 'section',
                        fitWidth: true
                    });
                            
                    this.renderToMasonry();
                });
            });
        }
        else {
            $(document).ready(() => {
                $("#PinSpread").masonry({
                    columnWidth: 'section',
                    itemSelector: 'section',
                    fitWidth: true
                });
                    
                this.renderToMasonry();
            });
        }
    }
    
    shouldComponentUpdate() {
        return false;
    }
    
    render() {
        return <div id="PinSpread"></div>;
    }
}

export default PinSpread;