import classNames from 'classnames/bind';
import { IconCircleCheckFilled, IconCircleCaretRight } from '@tabler/icons-react';

import styles from './TrackItem.module.scss';

const cx = classNames.bind(styles);

function TrackItem() {
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('info')}>
                    <h3 className={cx('title')}>1. Bạn sẽ làm được gì sau khóa học?</h3>
                    <p>
                        <IconCircleCaretRight size={18} color="rgba(240,81,35,.8)" />
                    </p>
                </div>
                <div className={cx('icon-box')}>
                    <IconCircleCheckFilled size={20} color="#5db85c" />
                </div>
            </div>
        </>
    );
}

export default TrackItem;
