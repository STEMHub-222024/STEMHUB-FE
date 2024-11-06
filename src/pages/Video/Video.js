import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconRobot, IconPlus, IconMinus } from '@tabler/icons-react';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse } from 'antd';

import styles from './Video.module.scss';
import Powered from '~/components/Layouts/Components/Powered';
import Heading from '~/components/Common/Heading';
import VideoPlayer from '~/components/Common/VideoPlayer';
import Comment from '~/components/Layouts/Components/Comment';
import ModalChat from '~/components/Layouts/Components/ModalChat';
import { handleSplitParam } from '~/utils/splitParamUrl';
import { getVideoAsync, getVideoLesson } from '~/app/slices/videoSlice';
import { getLessonIdAsync } from '~/app/slices/lessonSlice';
import { selectVideo } from '~/app/selectors';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';

const { Panel } = Collapse;
const cx = classNames.bind(styles);

function Video() {
    const { lessonId } = useParams();
    const dispatch = useDispatch();
    const { videoFilter } = useSelector(selectVideo).data;
    const [isOpen, setIsOpen] = useState(false);
    const [playedTime, setPlayedTime] = useState('0:00');
    const [lessonItem, setLessonItem] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchApi = async () => {
            try {
                const result = handleSplitParam(lessonId);
                if (result) {
                    const lesson = await dispatch(getLessonIdAsync({ lessonId: result })).unwrap();
                    setLessonItem(lesson || null);
                    
                    const videoAll = await dispatch(getVideoAsync({ signal: controller.signal })).unwrap();
                    const videoLesson = videoAll?.find(video => video?.lessonId === result);
                    if (videoLesson) {
                        await dispatch(getVideoLesson({ videoLesson })).unwrap();
                    }
                }
            } catch (error) {
            }
        };

        fetchApi();
        return () => controller.abort();
    }, [lessonId, dispatch]);

    const handleShowModal = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <>
            <div className={cx('wrapper')}>
                <VideoPlayer pathVideo={videoFilter?.path} setPlayedTime={setPlayedTime} />
            </div>
            <div className={cx('content')}>
                <div className={cx('contentTop')}>
                    <Heading>{lessonItem?.lessonName || ''}</Heading>
                    <button className={cx('addNote')} onClick={handleShowModal}>
                        <IconRobot className={cx('icon')} />
                        <span className={cx('label')}>
                            <span className={cx('num')}>{playedTime}</span>
                        </span>
                    </button>
                </div>
                <p>{videoFilter?.description_V}</p>

                {lessonItem && lessonItem.parts && (
                    <Collapse defaultActiveKey={['1']} expandIcon={({ isActive }) => isActive ? <IconMinus color='#7f56d9'/> : <IconPlus color='#7f56d9'/>}>
                        <Panel header={<div className={cx("heading")}>1. Vật liệu và thiết bị</div>} key="1">
                            <MarkdownParser content_C={lessonItem.parts.materialsHtmlContent || ''} />
                        </Panel>
                        <Panel header={<div className={cx("heading")}>2. Các bước thực hiện</div>} key="2">
                            <MarkdownParser content_C={lessonItem.parts.stepsHtmlContent || ''} />
                        </Panel>
                        <Panel header={<div className={cx("heading")}>3. Kết quả</div>} key="3">
                            <MarkdownParser content_C={lessonItem.parts.resultsHtmlContent || ''} />
                        </Panel>
                    </Collapse>
                )}
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
