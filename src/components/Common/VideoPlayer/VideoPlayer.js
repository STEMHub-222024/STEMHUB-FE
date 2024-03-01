import classNames from 'classnames/bind';
import ReactPlayer from 'react-player';
import { useState } from 'react';

import styles from './VideoPlayer.module.scss';

const cx = classNames.bind(styles);

function VideoPlayer({ ...props }) {
    const [played, setPlayed] = useState(0);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('player')}>
                <ReactPlayer
                    playing
                    width="100%"
                    height="100%"
                    url="https://youtu.be/6-x1AlDudZw?si=U0xVZXcCAzNO73MJ"
                    controls
                    onProgress={(progress) => {
                        setPlayed(progress.played);
                    }}
                    progressInterval={100}
                    config={{
                        youtube: {
                            playerVars: { start: 0, end: 240 },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default VideoPlayer;
