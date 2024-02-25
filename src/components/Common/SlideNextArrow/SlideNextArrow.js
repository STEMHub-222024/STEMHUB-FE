import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconChevronRight } from '@tabler/icons-react';
import styles from './SlideNextArrow.module.scss';

const cx = classNames.bind(styles);

function SlideNextArrow(props) {
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
                right: '-16px',
                zIndex: 10,
            }}
            onClick={onClick}
        >
            <IconChevronRight className={cx('icon')} size={20} color="#333" />
        </div>
    );
}

SlideNextArrow.propTypes = {
    props: PropTypes.object,
};

export default SlideNextArrow;
