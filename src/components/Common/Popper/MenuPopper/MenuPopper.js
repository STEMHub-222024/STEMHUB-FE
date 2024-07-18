import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './MenuPopper.module.scss';

import { Wrapper as PopperWrapper } from '~/components/Common/Popper';
import MenuPopperItem from './MenuPopperItem';
import Image from '~/components/Common/Image';
import Heading from '~/components/Common/Heading';
import useUserInfo from '~/hooks/useUserInfo';

const cx = classNames.bind(styles);

function MenuPopper({ children, items = [], infoUserCurrent }) {
    const { username, userId, lastName: currentLastName } = infoUserCurrent;
    const { data: userInfo } = useUserInfo(userId);

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
                    <PopperWrapper className={cx('menu-popper')}>
                        <div className={cx('info')}>
                            <Image
                                className={cx('user-avatar')}
                                src={userInfo?.image ?? ''}
                                alt={userInfo?.firstName ?? 'Avatar'}
                            />
                            <div className={cx('user-name')}>
                                <Heading h5 className={cx('heading')}>
                                    {`${userInfo?.lastName ?? currentLastName} ${userInfo?.firstName ?? ''}`}
                                </Heading>
                                <span>@{username}</span>
                            </div>
                        </div>
                        {renderItems()}
                    </PopperWrapper>
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
    infoUserCurrent: PropTypes.shape({
        username: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        lastName: PropTypes.string,
        firstName: PropTypes.string,
    }).isRequired,
};

export default MenuPopper;
