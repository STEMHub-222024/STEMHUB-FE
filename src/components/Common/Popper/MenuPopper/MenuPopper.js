import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import styles from './MenuPopper.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Common/Popper';
import MenuPopperItem from './MenuPopperItem';

const cx = classNames.bind(styles);

function MenuPopper({ children, items = [] }) {
    const renderItems = () => {
        return items.map((item, index) => <MenuPopperItem key={index} data={item} />);
    };
    return (
        <Tippy
            trigger="click"
            interactive
            offset={[10, 10]}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>{renderItems()}</PopperWrapper>
                </div>
            )}
        >
            {children}
        </Tippy>
    );
}
MenuPopper.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
};

export default MenuPopper;
