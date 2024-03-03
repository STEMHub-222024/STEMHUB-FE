import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './FallbackAvatar.module.scss';
import Image from '~/components/Common/Image';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function FallbackAvatar({ pro = false, linkImage, altImage, className }) {
    const classes = cx('user-avatar', {
        [className]: className,
        pro,
    });

    return (
        <div className={classes} style={pro ? { fontSize: '5.6px' } : { fontSize: '2.9px' }}>
            <Image className={cx('image')} src={linkImage} alt={altImage} />
            {pro ? <Image className={cx('crown')} src={images.crown} alt="crown" /> : ''}
        </div>
    );
}

FallbackAvatar.propTypes = {
    linkImage: PropTypes.string.isRequired,
    altImage: PropTypes.string.isRequired,
    className: PropTypes.string,
    pro: PropTypes.bool,
};

export default FallbackAvatar;
