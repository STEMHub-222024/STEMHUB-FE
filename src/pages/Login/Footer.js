import classNames from 'classnames/bind';
import { memo } from 'react';
import config from '~/config';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

const Footer = memo(() => (
    <div className={cx('footer')}>
        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
        <a href={config.routes.home}>Điều khoản sử dụng</a>
        của chúng tôi.
    </div>
));

export default Footer;
