import { useState } from 'react';
import { IconHeart, IconHeartFilled, IconMessageCircle2 } from '@tabler/icons-react';

import classNames from 'classnames/bind';
import styles from './Reaction.module.scss';

const cx = classNames.bind(styles);

function Reaction() {
    const [love, setLove] = useState(false);

    const handleLove = () => {
        setLove(!love);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('btnReact')}>
                {love ? (
                    <>
                        <IconHeartFilled size={20} className={cx('active')} onClick={handleLove} />
                        <span>30</span>
                    </>
                ) : (
                    <>
                        <IconHeart size={20} onClick={handleLove} />
                        <span>30</span>
                    </>
                )}
            </div>
            <div className={cx('btnReact')}>
                <IconMessageCircle2 size={20} />
                <span>4</span>
            </div>
        </div>
    );
}

export default Reaction;
