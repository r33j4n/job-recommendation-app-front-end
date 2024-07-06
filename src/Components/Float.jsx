import React from 'react';
import "./Float.css";
import  FloatImage from '../Resources/Images/floatImage.jpg'; 
const FloatContent = () => {
    return ( <React.Fragment>
        <div className='container-landing'>
            <div className="left">
                <div className='IntroText'>
                Your Career Compass, Powered by AI.
                </div>
                <div className="SubText">
                AI-Powered Job Matching: Where Talent Meets Opportunity.
                </div>
                <a href="#join" className="page-scroll">
                <div className="button_join">
                Find Your Perfect Fit
                </div>
                </a>
                
            </div>
            <div className="right">
                <img src={FloatImage} className='ImgFormat' />
            </div>

        </div>


    </React.Fragment> );
}
 
export default FloatContent;