import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useLayoutEffect, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import styles from './MenuPopper.module.scss';

import { Wrapper as PopperWrapper } from '~/components/Common/Popper';
import MenuPopperItem from './MenuPopperItem';
import Image from '~/components/Common/Image';
import Heading from '~/components/Common/Heading';
import { useDispatch } from 'react-redux';

// Check Auth
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { getUserIdAsync } from '~/app/slices/userSlice';

const cx = classNames.bind(styles);

function MenuPopper({ children, items = [], infoUserCurrent }) {
    const dispatch = useDispatch();
    const { username, userId } = infoUserCurrent;
    const [resetToken, setResetToken] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const { lastName, firstName, image } = userInfo;

    useLayoutEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch, resetToken]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setResetToken(!resetToken);
            } else {
                try {
                    const res = await dispatch(getUserIdAsync({ userId: userId })).unwrap();
                    if (res) setUserInfo(res);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, [dispatch, userId, resetToken]);
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
                            <Image className={cx('user-avatar')} src={image ?? ''} alt={firstName ?? 'Avatar'} />
                            <div className={cx('user-name')}>
                                <Heading h5 className={cx('heading')}>
                                    {`${lastName ?? infoUserCurrent.lastName} ${firstName}`}
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
};

export default MenuPopper;
