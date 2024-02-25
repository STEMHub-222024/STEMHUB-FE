import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './FallbackAvatar.module.scss';
import Image from '~/components/Common/Image';

const cx = classNames.bind(styles);

function FallbackAvatar({ linkImage, altImage, className }) {
    const classes = cx('user-avatar', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <Image className={cx('image')} src={linkImage} alt={altImage} />
        </div>
    );
}

FallbackAvatar.propTypes = {
    linkImage: PropTypes.string.isRequired,
    altImage: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default FallbackAvatar;
