import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';

import classNames from 'classnames/bind';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '~/config';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import { IconBellFilled, IconUser, IconReport, IconArrowBarRight, IconPencil } from '@tabler/icons-react';
import { Menu, MenuItem } from '~/components/Layouts/Components/Menu';
import { MenuPopper } from '~/components/Common/Popper/MenuPopper';
import Search from '~/features/search';

const cx = classNames.bind(styles);

function Header() {
    const [currentUser, setCurrentUser] = useState(true);

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
            to: '/',
        },
        {
            icon: <IconArrowBarRight size={15} color="#333" stroke={2} />,
            title: 'Đăng Xuất',
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
                <Search currentUser={currentUser} />
                <div className={cx('actions')}>
                    {currentUser ? (
                        <div className={cx('group-action')}>
                            <Tippy content="Hihi">
                                <button className={cx('action-btn')}>
                                    <IconBellFilled size={25} color="#707070" stroke={2} />
                                </button>
                            </Tippy>

                            <MenuPopper items={userMenu}>
                                <Image className={cx('user-avatar')} src={images.avatar_1} alt="Nguyen văn A" />
                            </MenuPopper>
                        </div>
                    ) : (
                        <>
                            <Button outline small rounded className={cx('custom-login')}>
                                Login
                            </Button>
                            <Button mainColor small rounded onClick={() => alert('Hi')}>
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
