import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconChevronLeft } from '@tabler/icons-react';
import styles from './SlidePrevArrow.module.scss';

const cx = classNames.bind(styles);

function SlidePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 3px 6px rgba(0,0,0,.16)',
                color: '#4b4b4b',
                cursor: 'pointer',
                height: '32px',
                position: 'absolute',
                textAlign: 'center',
                top: '50%',
                width: '32px',
                left: '-16px',
                zIndex: 10,
            }}
            onClick={onClick}
        >
            <IconChevronLeft className={cx('icon')} size={20} color="#333" />
        </div>
    );
}

SlidePrevArrow.propTypes = {
    props: PropTypes.object,
};

export default SlidePrevArrow;
