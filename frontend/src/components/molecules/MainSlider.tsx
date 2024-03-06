import Slider from "react-slick";

import "../../style/slider.css";
import "../../style/slider2.css";
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
    speed: 5000,
    autoplaySpeed: 500,
  };
  return (
    <div className="slick-slider pb-5">
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
