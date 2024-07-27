import classNames from 'classnames/bind';
import { memo } from 'react';
import Image from '~/components/Common/Image';
import styles from './SlideShow.module.scss';

const cx = classNames.bind(styles);

const SlideItem = memo(({ barber, index }) => (
    <div className={cx('wrapper', { [`slide-item-${index + 1}`]: true })} key={barber.bannerId}>
        <div className={cx('left')}>
            <h2 className={cx('heading')}>{barber.title}</h2>
            <p className={cx('desc')}>{barber.content}</p>
        </div>
        <div className={cx('right')}>
            <Image src={barber.image} alt={barber.title} />
        </div>
    </div>
));


export default SlideItem