import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Button, Drawer } from 'antd';
import Tracks from '~/components/Layouts/Components/Tracks';
import { LeftOutlined, RightOutlined, MenuOutlined } from '@ant-design/icons';
import { handleSplitParam } from '~/utils/splitParamUrl';
import styles from './FooterLesson.module.scss';

const cx = classNames.bind(styles);

function FooterLesson({ data, topicParameter }) {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const { lessonId } = useParams();

    const currentLessonId = useMemo(() => handleSplitParam(lessonId), [lessonId]);

    const currentIndex = useMemo(
        () => data.findIndex((lesson) => lesson.lessonId === currentLessonId),
        [data, currentLessonId],
    );

    const isFirstLesson = currentIndex === 0;
    const isLastLesson = currentIndex === data.length - 1;

    const navigateToLesson = useCallback(
        (index) => {
            if (index >= 0 && index < data.length) {
                const lesson = data[index];
                navigate(`/topic/${topicParameter}/${lesson.lessonName}=${lesson.lessonId}`);
            }
        },
        [data, navigate, topicParameter],
    );

    const handlePrevious = useCallback(() => navigateToLesson(currentIndex - 1), [navigateToLesson, currentIndex]);
    const handleNext = useCallback(() => navigateToLesson(currentIndex + 1), [navigateToLesson, currentIndex]);

    const toggleDrawer = useCallback(() => setVisible((prev) => !prev), []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('navigation')}>
                <Button
                    className={cx('btn-icon-lesson', { 'btn-icon-disabled': isFirstLesson })}
                    icon={<LeftOutlined />}
                    onClick={handlePrevious}
                    disabled={isFirstLesson}
                >
                    Bài trước
                </Button>
                <Button
                    className={cx('btn-icon-lesson', { 'btn-icon-disabled': isLastLesson })}
                    onClick={handleNext}
                    disabled={isLastLesson}
                >
                    Bài tiếp theo
                    <RightOutlined style={{ marginLeft: '8px' }} />
                </Button>
            </div>
            <div className={cx('menu')}>
                <Button className={cx('btn-icon')} size="middle" icon={<MenuOutlined />} onClick={toggleDrawer} />
            </div>
            <Drawer
                title="Nội dung chủ đề"
                placement="right"
                onClose={toggleDrawer}
                open={visible}
                height="100%"
                width="100%"
            >
                <Tracks data={data} topicParameter={topicParameter} onClose={toggleDrawer} />
            </Drawer>
        </div>
    );
}

export default React.memo(FooterLesson);
