import classNames from 'classnames/bind';
import { memo } from 'react';
import images from '~/assets/images';
import styles from './Introduce.module.scss';

const cx = classNames.bind(styles);

const ScientistImage = memo(({ scientist, index, onClick, isMain }) => {
    const imageClass = cx('scientist-image', { 'image-main': isMain });
    return (
        <div
            className={cx(
                `image-${['top-left', 'bottom-left', 'main', 'top-right', 'bottom-right'][index]}`,
                imageClass,
            )}
            style={{ backgroundImage: `url(${scientist?.image || images[`introduce_${index + 1}`]})` }}
            onClick={onClick}
        />
    );
});

export default ScientistImage;
