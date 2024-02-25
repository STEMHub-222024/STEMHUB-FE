import PropTypes from 'prop-types';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from './SlideShow.module.scss';
import Image from '~/components/Common/Image';
import SlideNextArrow from '~/components/Common/SlideNextArrow';
import SlidePrevArrow from '~/components/Common/SlidePrevArrow';

const cx = classNames.bind(styles);

const classNs = cx('center');

function SlideShow() {
    const settings = {
        dots: true,
        infinite: true,
        className: classNs,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
        adaptiveHeight: true,
        waitForAnimate: false,
        pauseOnHover: true,
        nextArrow: <SlideNextArrow />,
        prevArrow: <SlidePrevArrow />,
    };
    return (
        <div className={cx('slider-container')}>
            <Slider {...settings}>
                <div className={cx('slide-item-1')}>
                    <div className={cx('left')}>
                        <h2 className={cx('heading')}>
                            <a href="https://www.figma.com/file/hPct72csbW7e27wSvm0YQd/Education-or-Online-education-online-courses-or-elearning-or-lms-figma-template-(Community)?type=design&node-id=1-105&mode=design&t=usdl4ZosgpNPs55W-0">
                                Học HTML CSS cho người mới
                            </a>
                        </h2>
                        <p className={cx('desc')}>
                            Thực hành dự án với Figma, hàng trăm bài tập và thử thách, hướng dẫn 100% bởi Sơn Đặng, tặng
                            kèm Flashcards, v.v.
                        </p>
                    </div>
                    <div className={cx('right')}>
                        <Image src="https://files.fullstack.edu.vn/f8-prod/banners/Banner_01_2.png" alt="slideshow" />
                    </div>
                </div>
                <div className={cx('slide-item-2')}>
                    <div className={cx('left')}>
                        <h2 className={cx('heading')}>
                            <a href="https://www.figma.com/file/hPct72csbW7e27wSvm0YQd/Education-or-Online-education-online-courses-or-elearning-or-lms-figma-template-(Community)?type=design&node-id=1-105&mode=design&t=usdl4ZosgpNPs55W-0">
                                F8 trên Facebook
                            </a>
                        </h2>
                        <p className={cx('desc')}>
                            F8 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT và có những con người yêu
                            thích lập trình F8 sẽ ở đó.
                        </p>
                    </div>
                    <div className={cx('right')}>
                        <Image
                            src="https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png"
                            alt="slideshow"
                        />
                    </div>
                </div>
                <div className={cx('slide-item-3')}>
                    <div className={cx('left')}>
                        <h2 className={cx('heading')}>
                            <a href="https://www.figma.com/file/hPct72csbW7e27wSvm0YQd/Education-or-Online-education-online-courses-or-elearning-or-lms-figma-template-(Community)?type=design&node-id=1-105&mode=design&t=usdl4ZosgpNPs55W-0">
                                Mở Bán Áo Polo F8 Đợt 2
                            </a>
                        </h2>
                        <p className={cx('desc')}>
                            Áo Polo F8 với thiết kế tối giản, lịch sự, phù hợp mặc mọi lúc, mọi nơi. Chất áo mềm mại,
                            thoáng mát, ngực và tay áo in logo F8 - Fullstack.
                        </p>
                    </div>
                    <div className={cx('right')}>
                        <Image
                            src="https://files.fullstack.edu.vn/f8-prod/banners/36/6454dee96205c.png"
                            alt="slideshow"
                        />
                    </div>
                </div>
            </Slider>
        </div>
    );
}

SlideShow.propTypes = {};

export default SlideShow;
