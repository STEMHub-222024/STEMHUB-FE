import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import SlideNextArrow from '~/components/Common/SlideNextArrow';
import SlidePrevArrow from '~/components/Common/SlidePrevArrow';
import { useDispatch } from 'react-redux';
import { getBannerAsync } from '~/app/slices/slideShowSlice';
import styles from './SlideShow.module.scss';

const SlideItem = lazy(() => import('./SlideItem'));
const cx = classNames.bind(styles);

function SlideShow() {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!data.length) {  
            const fetchApi = async () => {
                try {
                    const response = await dispatch(getBannerAsync()).unwrap();
                    if (response) {
                        setData(response);
                    }
                } catch (error) {
                    console.error('Error fetching banners:', error);
                }
            };
            fetchApi();
        }
    }, [data, dispatch]);

    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: true,
        className: cx('center'),
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
        lazyLoad: 'ondemand',
    }), []);

    return (
        <div className={cx('slider-container')}>
            <Slider {...sliderSettings}>
                {data?.map((barber, index) => (
                    <Suspense fallback={<div>Loading item...</div>} key={barber.bannerId}>
                        <SlideItem barber={barber} index={index} />
                    </Suspense>
                ))}
            </Slider>
        </div>
    );
}

export default SlideShow;
