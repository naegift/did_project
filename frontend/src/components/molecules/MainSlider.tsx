import Slider from "react-slick";

import "../../styles/slider.css";
import "../../styles/slider2.css";
import {
    bannerImg3,
    bannerImg4,
    bannerImg5,
    bannerImg6,
} from "../../images/Banner";

const MainSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };
    return (
        <div className="slider-container slick-slider pb-5">
            <Slider {...settings}>
                <div>
                    <img src={bannerImg4} alt="" />
                </div>
                <div>
                    <img src={bannerImg5} alt="" />
                </div>
                <div>
                    <img src={bannerImg6} alt="" />
                </div>
                <div>
                    <img src={bannerImg3} alt="" />
                </div>
            </Slider>
        </div>
    );
};

export default MainSlider;
