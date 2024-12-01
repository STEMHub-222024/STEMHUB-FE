import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReactPlayer from 'react-player';
import formatTime from '~/utils/formatTime';

import styles from './VideoPlayer.module.scss';

const cx = classNames.bind(styles);

function VideoPlayer({ isPlayed = true, isPlayTime, pathVideo, setPlayedTime }) {
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleProgress = useCallback(
        (progress) => {
            setPlayed(progress.played);
        },
        [setPlayed],
    );

    const handleDuration = useCallback(
        (dur) => {
            setDuration(dur);
        },
        [setDuration],
    );

    useEffect(() => {
        if (isPlayTime) return;

        const playedTimeInSeconds = played * duration;
        const playedTimeFormatted = formatTime(playedTimeInSeconds);
        setPlayedTime(playedTimeFormatted);
    }, [isPlayTime, played, duration, setPlayedTime]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('player')}>
                <ReactPlayer
                    playing={isPlayed}
                    width="100%"
                    height="90%"
                    url={pathVideo}
                    controls
                    onProgress={handleProgress}
                    onDuration={handleDuration}
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

VideoPlayer.propTypes = {
    pathVideo: PropTypes.string,
    isPlayed: PropTypes.bool,
    isPlayTime: PropTypes.bool,
};

export default VideoPlayer;
