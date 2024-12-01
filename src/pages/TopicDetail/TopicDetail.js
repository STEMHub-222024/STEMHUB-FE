import { useParams } from 'react-router-dom';
import { IconMovie, IconUsersGroup, IconBattery4, IconCheck } from '@tabler/icons-react';
import classNames from 'classnames/bind';
import { NumericFormat } from 'react-number-format';
import styles from './TopicDetail.module.scss';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import CurriculumOfCourse from '~/components/Common/CurriculumOfCourse';
import { handleSplitParam } from '~/utils/splitParamUrl';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopicId } from '~/app/slices/topicSlice';
import { getLessonAsync, handleFilter } from '~/app/slices/lessonSlice';
import { getIngredientAsync, handleFillerIngredient } from '~/app/slices/ingredientSlice';
import { selectTopic, selectLesson, selectIngredient } from '~/app/selectors';

import { Modal } from 'antd';
import VideoPlayer from '~/components/Common/VideoPlayer';
import Loading from '~/components/Common/Loading';

const cx = classNames.bind(styles);

const fetchApiData = async (dispatch, topic) => {
    const result = handleSplitParam(topic);
    if (result) {
        await dispatch(getTopicId({ topicId: result })).unwrap();

        const [lessonAll, ingredientAll] = await Promise.all([
            dispatch(getLessonAsync()).unwrap(),
            dispatch(getIngredientAsync()).unwrap(),
        ]);

        const lessonCurrents = lessonAll.filter(lesson => lesson?.topicId === result);
        const ingredientCurrents = ingredientAll.filter(ingredient => ingredient?.topicId === result);

        if (lessonCurrents.length) {
            dispatch(handleFilter({ lessonCurrents }));
        }

        if (ingredientCurrents.length) {
            dispatch(handleFillerIngredient({ ingredientCurrents }));
        }
    }
};

function TopicDetail() {
    const { topic } = useParams();
    const dispatch = useDispatch();
    const { topicIds } = useSelector(selectTopic);
    const { lessonFilter } = useSelector(selectLesson).data;
    const { ingredientFilter } = useSelector(selectIngredient).data;
    const [openTopic, setOpenTopic] = useState(false);
    const [isPlayed, setIsPlayed] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);
                await fetchApiData(dispatch, topic);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, [dispatch, topic]);

    const handleShowModal = useCallback(() => {
        setOpenTopic(prev => !prev);
        setIsPlayed(prev => !prev);
    }, []);

    const renderIngredients = useMemo(
        () => ingredientFilter?.map(ingredient => (
            <li key={ingredient?.ingredientsId}>
                <IconCheck className={cx('icon')} size={20} />
                <span>{ingredient?.ingredientsName}</span>
            </li>
        )),
        [ingredientFilter],
    );

    if (loading) {
        return <Loading title='Đang tải....' />;
    }

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('grid', 'topic-detail-content')}>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-8')}>
                            <div className={cx('group-title')}>
                                <Heading className={cx('heading')}>{topicIds?.topicName}</Heading>
                                <div className={cx('desc')}>
                                    <p>{topicIds?.description}</p>
                                </div>
                                <div className={cx('topicList')}>
                                    <Heading className={cx('topicHeading')} h2>Giới thiệu</Heading>
                                    <section className={cx('row')}>
                                        <section className={cx('col')}>
                                            <ul className={cx('list')}>{renderIngredients}</ul>
                                        </section>
                                    </section>
                                </div>
                            </div>
                            <CurriculumOfCourse data={lessonFilter} />
                        </div>
                        <div className={cx('grid-column-4')}>
                            <div className={cx('purchaseBadge')}>
                                <div className={cx('imgPreview')}>
                                    <div
                                        className={cx('bg')}
                                        style={{ backgroundImage: `url("${topicIds?.topicImage}")` }}
                                    />
                                    {/* <div className={cx('overlay')} onClick={handleShowModal}>
                                        <IconPlayerPlay size={35} stroke={3} style={{ color: '#7f56d9' }} />
                                    </div> */}
                                    {/* <p>Xem giới thiệu chủ đề</p> */}
                                </div>

                                <h5>Miễn phí </h5>

                                <Button
                                    className={cx('btn-join')}
                                    mainColor
                                    medium
                                    borderMedium
                                    to={
                                        lessonFilter[0]?.lessonId
                                            ? `${lessonFilter[0]?.lessonId}`
                                            : ''
                                    }
                                >
                                    {lessonFilter[0]?.lessonId ? 'Tham Gia học' : 'Sắp ra mắt'}
                                </Button>

                                <ul>
                                    <li>
                                        <IconMovie className={cx('icon')} size={20} stroke={2} />
                                        <span className={cx('list-item')}>Tổng số {lessonFilter.length} bài học</span>
                                    </li>
                                    <li>
                                        <IconUsersGroup className={cx('icon')} size={20} stroke={2} />
                                        <span className={cx('list-item')}>
                                            Tổng số lượt xem
                                            <NumericFormat
                                                className={cx('numberFormat')}
                                                value={topicIds?.view}
                                                thousandSeparator="./"
                                            />
                                        </span>
                                    </li>
                                    <li>
                                        <IconBattery4 className={cx('icon')} size={20} stroke={2} />
                                        <span className={cx('list-item')}>Học mọi lúc, mọi nơi</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('wrapper-btn-join')}>
                    <Button
                        className={cx('btn-join')}
                        mainColor
                        medium
                        borderMedium
                        to={
                            lessonFilter[0]?.lessonId
                                ? `${lessonFilter[0]?.lessonName}=${lessonFilter[0]?.lessonId}`
                                : ''
                        }
                    >
                        {lessonFilter[0]?.lessonId ? 'Tham Gia học' : 'Sắp ra mắt'}
                    </Button>
                </div>
            </div>

            <Modal
                title="Giới thiệu chủ đề"
                centered
                open={openTopic}
                onCancel={handleShowModal}
                width={1000}
                footer={null}
                key={openTopic ? 'open' : 'closed'}
            >
                {topicIds ? (
                    <VideoPlayer pathVideo={topicIds.videoReview} isPlayed={isPlayed} isPlayTime />
                ) : (
                    <div style={{ padding: '20px' }}>
                        <h3>Thông báo</h3>
                        <p>Hiện tại không có video nào để xem.</p>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default TopicDetail;