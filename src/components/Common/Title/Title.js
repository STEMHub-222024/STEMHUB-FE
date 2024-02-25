import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Title.module.scss';

const cx = classNames.bind(styles);

function Title({ title }) {
    return (
        <div className={cx('title')}>
            <div className={cx('title__line')}></div>
            <h3 className={cx('title__heading')}>{title}</h3>
            <div className={cx('title__line')}></div>
        </div>
    );
}

Title.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Title;
