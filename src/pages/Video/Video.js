import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconSquareRoundedPlus } from '@tabler/icons-react';

import styles from './Video.module.scss';
import Powered from '~/components/Layouts/Components/Powered';
import Heading from '~/components/Common/Heading';
import VideoPlayer from '~/components/Common/VideoPlayer';
import Comment from '~/components/Layouts/Components/Comment';
import { handleSplitParam, handleSplitParamBefore } from '~/utils/splitParamUrl';

//Services
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoAsync, getVideoLesson } from '~/app/slices/videoSlice';
import { selectVideo } from '~/app/selectors';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Video() {
    const { lessonId } = useParams();
    const dispatch = useDispatch();
    const { videoFilter } = useSelector(selectVideo).data;
    const titleLesson = handleSplitParamBefore(lessonId);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = handleSplitParam(lessonId);

                if (result) {
                    const videoAll = await dispatch(getVideoAsync()).unwrap();
                    if (videoAll) {
                        const videoLesson = videoAll?.find((video) => {
                            return video?.lessonId === result;
                        });
                        if (videoLesson) {
                            dispatch(
                                getVideoLesson({
                                    videoLesson,
                                }),
                            );
                        }
                    }
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };

        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch, lessonId]);

    return (
        <>
            <div className={cx('wrapper')}>
                <VideoPlayer pathVideo={videoFilter?.path} />
            </div>

            <div className={cx('content')}>
                <div className={cx('contentTop')}>
                    <Heading>{titleLesson}</Heading>
                    <button className={cx('addNote')}>
                        <IconSquareRoundedPlus size={20} strokeWidth={1} />
                        <span className={cx('label')}>
                            Thêm ghi chú tại
                            <span className={cx('num')}>00:10</span>
                        </span>
                    </button>
                </div>

                <p>Tham gia các cộng đồng để cùng học hỏi, chia sẻ và "thám thính"</p>

                <div className={cx('contentBottom')}>
                    <Comment />
                </div>
            </div>
            <Powered />
        </>
    );
}

export default Video;
