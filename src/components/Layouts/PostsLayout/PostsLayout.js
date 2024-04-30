import classNames from 'classnames/bind';
import Footer from '../Components/Footer';
import HeaderPost from '../Components/HeaderPost';
import styles from './PostsLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <HeaderPost />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
