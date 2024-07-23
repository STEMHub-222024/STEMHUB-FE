import { useEffect } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from './SlideShow.module.scss';
import Image from '~/components/Common/Image';
import SlideNextArrow from '~/components/Common/SlideNextArrow';
import SlidePrevArrow from '~/components/Common/SlidePrevArrow';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { getBannerAsync } from '~/app/slices/slideShowSlice';
import { selectBanner } from '~/app/selectors';
import config from '~/config';

const cx = classNames.bind(styles);

function SlideShow() {
    const dispatch = useDispatch();
    const { data } = useSelector(selectBanner);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getBannerAsync()).unwrap();
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();
    }, [dispatch]);

    const classNs = cx('center');

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
                {data
                    ? data?.map((barber, index) => (
                          <div className={cx('wrapper', { [`slide-item-${index + 1}`]: true })} key={barber.bannerId}>
                              <div className={cx('left')}>
                                  <h2 className={cx('heading')}>
                                      <a href={config.routes.home}>{barber.title}</a>
                                  </h2>
                                  <p className={cx('desc')}>{barber?.content}</p>
                              </div>
                              <div className={cx('right')}>
                                  <Image src={barber.image} alt={barber.title} />
                              </div>
                          </div>
                      ))
                    : ''}
            </Slider>
        </div>
    );
}

SlideShow.propTypes = {};

export default SlideShow;
