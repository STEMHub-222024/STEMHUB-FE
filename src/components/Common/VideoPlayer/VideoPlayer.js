import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ReactPlayer from 'react-player';

import styles from './VideoPlayer.module.scss';

const cx = classNames.bind(styles);

function VideoPlayer({ pathVideo }) {
    const [played, setPlayed] = useState(0);
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
};

export default VideoPlayer;
