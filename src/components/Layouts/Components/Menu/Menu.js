import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

const Menu = ({ className, children }) => <nav className={cx('wrapper', className)}>{children}</nav>;

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Menu;
