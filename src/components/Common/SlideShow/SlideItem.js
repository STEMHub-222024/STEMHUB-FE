import classNames from 'classnames/bind';
import { memo, useMemo } from 'react';
import Image from '~/components/Common/Image';
import { URL_FACEBOOK, URL_YOUTUBE } from '~/utils/constant';
import { Link } from 'react-router-dom';
import config from '~/config';
import styles from './SlideShow.module.scss';

const cx = classNames.bind(styles);

const SlideItem = memo(({ barber, index }) => {
    const slideClass = useMemo(() => cx('wrapper', `slide-item-${index + 1}`), [index]);

    return (
        <div className={slideClass}>
            <div className={cx('left')}>
                <h2 className={cx('heading')}>{barber.title}</h2>
                <p className={cx('desc')}>{barber.content}</p>

                {index === 0 ? (
                    <Link
                        className={cx('register-btn')}
                        to={config.routes.stemAI}
                        
                    >
                        Khám phá
                    </Link>
                ) : (
                    <a
                        href={index === 1 ? URL_YOUTUBE : URL_FACEBOOK}
                        className={cx('register-btn', {
                            'btn-primary': index === 0,
                            'btn-secondary': index === 1,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {index === 1 ? 'Đăng ký kênh' : 'Đăng ký ngay' }
                    </a>
                )}
            </div>
            <div className={cx('right')}>
                <Image
                    src={barber.image}
                    alt={barber.title}
                    className={cx('image')}
                    loading="lazy"
                />
            </div>
        </div>
    );
});

export default SlideItem;
