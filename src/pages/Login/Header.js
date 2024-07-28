import classNames from 'classnames/bind';
import { memo } from 'react';
import config from '~/config';
import images from '~/assets/images';
import Image from '~/components/Common/Image';
import Button from '~/components/Common/Button';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

const Header = memo(() => (
    <div className={cx('header')}>
        <Button className={cx('logo-link')} to={config.routes.home}>
            <Image className={cx('logo')} src={images.logo} alt="web khóa học" />
        </Button>
        <h1 className={cx('title')}>Đăng nhập vào Web</h1>
    </div>
));

export default Header;
