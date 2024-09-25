import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import SlideNextArrow from '~/components/Common/SlideNextArrow';
import SlidePrevArrow from '~/components/Common/SlidePrevArrow';
import styles from './SlideShow.module.scss';
import * as bannerServices from '~/services/bannerServices';
import Loading from '~/components/Common/Loading';

const SlideItem = lazy(() => import('./SlideItem'));
const cx = classNames.bind(styles);

function SlideShow() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const cachedData = sessionStorage.getItem('bannerData');
            if (cachedData) {
                setData(JSON.parse(cachedData));
            } else {
                try {
                    const response = await bannerServices.getBanner();
                    if (response) {
                        setData(response);
                        sessionStorage.setItem('bannerData', JSON.stringify(response));
                    }
                } catch (error) {}
            }
        };
        fetchApi();
    }, []);

    const sliderSettings = useMemo(
        () => ({
            dots: true,
            infinite: true,
            className: cx('center'),
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'ease-in-out',
            adaptiveHeight: true,
            waitForAnimate: true,
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
                    <Suspense fallback={<Loading />} key={barber.bannerId}>
                        <SlideItem barber={barber} index={index} />
                    </Suspense>
                ))}
            </Slider>
        </div>
    );
}

export default SlideShow;
