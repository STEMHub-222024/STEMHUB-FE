import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useUserInfo from '~/hooks/useUserInfo';
import Search from '~/features/search';
import config from '~/config';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import Loading from '~/components/Common/Loading';
import { Menu, MenuItem } from '~/components/Layouts/Components/Menu';
import { MenuPopper } from '~/components/Common/Popper/MenuPopper';
import { IconUser, IconReport, IconArrowBarRight, IconPencil } from '@tabler/icons-react';
import { selectAuth } from '~/app/selectors';
import { logout } from '~/app/slices/authSlice';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const { data: userInfo, isLoading: isUserLoading } = useUserInfo(infoUserCurrent?.userId);
    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const userMenu = useMemo(
        () => [
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
        ],
        [handleLogout],
    );

    if (isUserLoading) return <Loading />;

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
                            <MenuPopper items={userMenu} infoUserCurrent={infoUserCurrent}>
                                <Image
                                    className={cx('user-avatar')}
                                    src={userInfo?.image ?? ''}
                                    alt={userInfo?.firstName ?? 'Avatar'}
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

export default React.memo(Header);
