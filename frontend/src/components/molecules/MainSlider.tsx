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
    <div className="slider-container slick-slider pb-5 ">
      <Slider {...settings}>
        <div className="">
          <img src={bannerImg4} className="w-full" />
        </div>
        <div>
          <img src={bannerImg5} className="w-full" />
        </div>
        <div>
          <img src={bannerImg6} className="w-full" />
        </div>
        <div>
          <img src={bannerImg3} className="w-full" />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlider;
