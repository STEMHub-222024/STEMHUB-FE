import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconRobot } from '@tabler/icons-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Video.module.scss';
import Powered from '~/components/Layouts/Components/Powered';
import Heading from '~/components/Common/Heading';
import VideoPlayer from '~/components/Common/VideoPlayer';
import Comment from '~/components/Layouts/Components/Comment';
import ModalChat from '~/components/Layouts/Components/ModalChat';
import { handleSplitParam, handleSplitParamBefore } from '~/utils/splitParamUrl';
import { getVideoAsync, getVideoLesson } from '~/app/slices/videoSlice';
import { selectVideo } from '~/app/selectors';

const cx = classNames.bind(styles);

function Video() {
    const { lessonId } = useParams();
    const dispatch = useDispatch();
    const { videoFilter } = useSelector(selectVideo).data;
    const titleLesson = useMemo(() => handleSplitParamBefore(lessonId), [lessonId]);
    const [isOpen, setIsOpen] = useState(false);
    const [playedTime, setPlayedTime] = useState('0:00');

    useEffect(() => {
        const controller = new AbortController();
        const fetchApi = async () => {
            try {
                const result = handleSplitParam(lessonId);
                if (result) {
                    const videoAll = await dispatch(getVideoAsync({ signal: controller.signal })).unwrap();
                    if (videoAll) {
                        const videoLesson = videoAll?.find((video) => video?.lessonId === result);
                        if (videoLesson) {
                            dispatch(getVideoLesson({ videoLesson }));
                        }
                    }
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                }
            }
        };

        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch, lessonId]);

    const handleShowModal = useCallback(() => setIsOpen((prevIsOpen) => !prevIsOpen), []);

    return (
        <>
            <div className={cx('wrapper')}>
                <VideoPlayer pathVideo={videoFilter?.path} setPlayedTime={setPlayedTime} />
            </div>
            <div className={cx('content')}>
                <div className={cx('contentTop')}>
                    <Heading>{titleLesson}</Heading>
                    <button className={cx('addNote')} onClick={handleShowModal}>
                        <IconRobot className={cx('icon')} />
                        <span className={cx('label')}>
                            <span className={cx('num')}>{playedTime}</span>
                        </span>
                    </button>
                </div>
                <p>{videoFilter?.description_V}</p>
                <div className={cx('contentBottom')}>
                    <Comment />
                </div>
            </div>
            <Powered />
            <ModalChat setIsOpen={setIsOpen} isOpen={isOpen} />
        </>
    );
}

export default Video;
