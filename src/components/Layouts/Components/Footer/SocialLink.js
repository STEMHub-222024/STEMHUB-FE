import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const SocialLink = ({ Icon, href }) => (
    <a className={cx('link')} href={href}>
        <Icon size={18} className={cx('icon')} />
    </a>
);

export default SocialLink;
