import classNames from 'classnames/bind';
import { IconHeartHandshake } from '@tabler/icons-react';

import styles from './Powered.module.scss';

const cx = classNames.bind(styles);

function Powered() {
    return (
        <p className={cx('wrapper')}>
            Welcome to
            <IconHeartHandshake size={20} color="#d43c68" stroke={3.5} />
            STEM
            <span className={cx('dot')}>.</span>
        </p>
    );
}

export default Powered;
