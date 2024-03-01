import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/components/Layouts/Components/Header';
import styles from './LessonLayout.module.scss';
import Tracks from '~/components/Layouts/Components/Tracks';

const cx = classNames.bind(styles);

function LessonLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
                <Tracks />
            </div>
        </div>
    );
}
LessonLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LessonLayout;
