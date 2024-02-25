import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu({ className, children }) {
    return (
        <nav
            className={cx('wrapper', {
                [className]: className,
            })}
        >
            {children}
        </nav>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;
