import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MenuPopper.module.scss';
import Button from '~/components/Common/Button';

const cx = classNames.bind(styles);

const classes = cx('menu-item');

function MenuPopperItem({ data }) {
    return (
        <Button className={classes} leftIcon={data.icon} to={data.to}>
            {data.title}
        </Button>
    );
}

MenuPopperItem.propTypes = {
    data: PropTypes.object,
};

export default MenuPopperItem;
