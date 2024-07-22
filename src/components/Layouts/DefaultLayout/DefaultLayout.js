import classNames from 'classnames/bind';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import NavigationBar from '../Components/NavigationBar';
import OptionPublic from '~/components/Common/OptionPublic';

import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <OptionPublic />
            <Footer />
            <div className={cx('navigation-bar')}>
                <NavigationBar />
            </div>
        </div>
    );
}

export default DefaultLayout;
