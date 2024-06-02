import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReactPlayer from 'react-player';

import styles from './VideoPlayer.module.scss';

const cx = classNames.bind(styles);

function VideoPlayer({ pathVideo, setPlayedTime }) {
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        const playedTimeInSeconds = played * duration;
        const playedTimeFormatted = formatTime(playedTimeInSeconds);
        setPlayedTime(playedTimeFormatted);
    }, [played, duration, setPlayedTime]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('player')}>
                <ReactPlayer
                    playing
                    width="100%"
                    height="100%"
                    url={pathVideo}
                    controls
                    onProgress={(progress) => {
                        setPlayed(progress.played);
                    }}
                    onDuration={(dur) => setDuration(dur)}
                    progressInterval={100}
                    config={{
                        youtube: {
                            playerVars: { start: 0, end: 240 },
                        },
                    }}
                />
            </div>
            <div className={cx('time-display')}>Played Time: {formatTime(played * duration)}</div>
        </div>
    );
}

VideoPlayer.propTypes = {
    pathVideo: PropTypes.string,
    setPlayedTime: PropTypes.func.isRequired,
};

export default VideoPlayer;
