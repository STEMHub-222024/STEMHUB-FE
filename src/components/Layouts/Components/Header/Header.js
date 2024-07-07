import 'tippy.js/dist/tippy.css';
import Cookies from 'js-cookie';
import { useLayoutEffect, useEffect, useState, useCallback } from 'react';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import Search from '~/features/search';
import config from '~/config';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import { Menu, MenuItem } from '~/components/Layouts/Components/Menu';
import { MenuPopper } from '~/components/Common/Popper/MenuPopper';
import { IconBellFilled, IconUser, IconReport, IconArrowBarRight, IconPencil } from '@tabler/icons-react';

// Check Auth
import { selectAuth } from '~/app/selectors';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { getUserIdAsync } from '~/app/slices/userSlice';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const [resetToken, setResetToken] = useState(false);
    const [userInfo, setUserInfo] = useState({});

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
            if (!infoUserCurrent.userId) {
                setResetToken((prev) => !prev);
            } else {
                try {
                    const res = await dispatch(getUserIdAsync({ userId: infoUserCurrent.userId })).unwrap();
                    if (res) setUserInfo(res);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, [dispatch, infoUserCurrent, resetToken]);

    const handleLogout = useCallback(() => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('saveRefreshToken');
        dispatch(setAllow(false));
    }, [dispatch]);

    const userMenu = [
        {
            icon: <IconUser size={15} color="#333" stroke={2} />,
            title: 'Trang cá nhân',
            to: config.routes.personal,
        },
        {
            icon: <IconPencil size={15} color="#333" stroke={2} />,
            title: 'Viết blog',
            to: config.routes.newPost,
        },
        {
            icon: <IconReport size={15} color="#333" stroke={2} />,
            title: 'Bài viết của tôi',
            to: config.routes.myPosts,
        },
        {
            icon: <IconArrowBarRight size={15} color="#333" stroke={2} />,
            title: 'Đăng Xuất',
            logout: handleLogout,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('group-logo')}>
                    <Link to={config.routes.home} className={cx('small-group-logo')}>
                        <img src={images.logo} className={cx('logo')} alt="stem" />
                        <h2 className={cx('trademark')}>STEM</h2>
                    </Link>
                </div>
                <aside className={cx('group-menu')}>
                    <Menu>
                        <MenuItem title="HOME" to={config.routes.home} icon={null} />
                        <MenuItem title="STEM 10" to={config.routes.stem10} icon={null} />
                        <MenuItem title="STEM 11" to={config.routes.stem11} icon={null} />
                        <MenuItem title="STEM 12" to={config.routes.stem12} icon={null} />
                        <MenuItem title="POSTS" to={config.routes.posts} icon={null} />
                    </Menu>
                </aside>
                <Search currentUser={allow} />
                <div className={cx('actions')}>
                    {allow ? (
                        <div className={cx('group-action')}>
                            <button className={cx('action-btn')}>
                                <IconBellFilled size={25} color="#707070" stroke={2} />
                            </button>

                            <MenuPopper items={userMenu} infoUserCurrent={infoUserCurrent}>
                                <Image
                                    className={cx('user-avatar')}
                                    src={userInfo.image ?? ''}
                                    alt={userInfo.firstName ?? 'Avatar'}
                                />
                            </MenuPopper>
                        </div>
                    ) : (
                        <>
                            <Button outline small rounded className={cx('custom-login')} to={config.routes.login}>
                                Login
                            </Button>
                            <Button mainColor small rounded to={config.routes.register}>
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
