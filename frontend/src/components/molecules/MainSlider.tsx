import Slider from "react-slick";

import "../../styles/slider.css";
import "../../styles/slider2.css";
import {
  bannerImg3,
  engBanner2,
  sponsBanner,
  giftBanner4,
  ethBanner,
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
          <img src={engBanner2} className="w-full" />
        </div>
        <div>
          <img src={giftBanner4} className="w-full " />
        </div>
        <div>
          <img src={ethBanner} className="w-full" />
        </div>
        <div>
          <img src={sponsBanner} className="w-full" />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlider;
