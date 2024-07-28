import { useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import SlideItem from './SlideItem';
import SlideNextArrow from '~/components/Common/SlideNextArrow';
import SlidePrevArrow from '~/components/Common/SlidePrevArrow';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { getBannerAsync } from '~/app/slices/slideShowSlice';
import { selectBanner } from '~/app/selectors';

import styles from './SlideShow.module.scss';

const cx = classNames.bind(styles);
function SlideShow() {
    const dispatch = useDispatch();
    const { data } = useSelector(selectBanner);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getBannerAsync()).unwrap();
            } catch (rejectedValueOrSerializedError) {}
        };
        fetchApi();
    }, [dispatch]);

    const sliderSettings = useMemo(
        () => ({
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
        }),
        [],
    );

    return (
        <div className={cx('slider-container')}>
            <Slider {...sliderSettings}>
                {data?.map((barber, index) => (
                    <SlideItem barber={barber} index={index} key={barber.bannerId} />
                ))}
            </Slider>
        </div>
    );
}

export default SlideShow;
