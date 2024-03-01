import classNames from 'classnames/bind';
import { IconHeartHandshake } from '@tabler/icons-react';

import styles from './Powered.module.scss';

const cx = classNames.bind(styles);

function Powered() {
    return (
        <p className={cx('wrapper')}>
            Made with
            <IconHeartHandshake size={20} color="#d43c68" stroke={3.5} />
            <span className={cx('dot')}>.</span>
            Powered by nvd
        </p>
    );
}

export default Powered;
