import classNames from 'classnames/bind';

import styles from './SignInButton.module.scss';
import Image from '~/components/Common/Image';

const cx = classNames.bind(styles);

function SignInButton() {
    return (
        <div className={cx('wrapper')}>
            <Image
                className={cx('icon')}
                src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M10%2011c-2.67%200-8%201.34-8%204v3h16v-3c0-2.66-5.33-4-8-4m0-9C7.79%202%206%203.79%206%206s1.79%204%204%204%204-1.79%204-4-1.79-4-4-4m0%2010.9c2.97%200%206.1%201.46%206.1%202.1v1.1H3.9V15c0-.64%203.13-2.1%206.1-2.1m0-9a2.1%202.1%200%20110%204.2%202.1%202.1%200%20010-4.2'%20fill-opacity='.54'%20fill-rule='evenodd'%3e%3c/path%3e%3c/svg%3e"
                alt="Đăng nhâp với personal"
            />
            <span className={cx('title')}>Sử dụng tài khoản </span>
        </div>
    );
}

export default SignInButton;
