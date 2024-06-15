import { useEffect, useState } from 'react';
import { IconHeart, IconHeartFilled, IconMessageCircle2 } from '@tabler/icons-react';
import classNames from 'classnames/bind';
import styles from './Reaction.module.scss';

const cx = classNames.bind(styles);

function Reaction() {
    const [love, setLove] = useState(() => {
        return JSON.parse(localStorage.getItem('love')) || false;
    });
    const [loveCount, setLoveCount] = useState(() => {
        return JSON.parse(localStorage.getItem('loveCount')) || 30;
    });

    const handleLove = () => {
        const newLoveState = !love;
        setLove(newLoveState);
        setLoveCount((currentCount) => (newLoveState ? currentCount + 1 : currentCount - 1));
    };

    useEffect(() => {
        localStorage.setItem('love', JSON.stringify(love));
        localStorage.setItem('loveCount', JSON.stringify(loveCount));
    }, [love, loveCount]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('btnReact')}>
                {love ? (
                    <>
                        <IconHeartFilled size={20} className={cx('active')} onClick={handleLove} />
                        <span>{loveCount}</span>
                    </>
                ) : (
                    <>
                        <IconHeart size={20} onClick={handleLove} />
                        <span>{loveCount}</span>
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
