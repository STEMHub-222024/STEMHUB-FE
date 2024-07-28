import PropTypes from 'prop-types';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

const MenuItem = memo(({ title, to, icon }) => (
    <NavLink className={(nav) => cx('menu-item', { active: nav.isActive })} to={to}>
        {icon}
        <span className={cx('title')}>{title}</span>
    </NavLink>
));

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
};

export default MenuItem;
