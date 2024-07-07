import { useParams } from 'react-router-dom';
import { IconPlayerPlay, IconMovie, IconUsersGroup, IconBattery4, IconCheck } from '@tabler/icons-react';
import classNames from 'classnames/bind';
import { NumericFormat } from 'react-number-format';
import styles from './TopicDetail.module.scss';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import CurriculumOfCourse from '~/components/Common/CurriculumOfCourse';
import { handleSplitParam } from '~/utils/splitParamUrl';

//Service
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopicId } from '~/app/slices/topicSlice';
import { getLessonAsync, handleFilter } from '~/app/slices/lessonSlice';
import { getIngredientAsync, handleFillerIngredient } from '~/app/slices/ingredientSlice';
import { selectTopic, selectLesson, selectIngredient } from '~/app/selectors';

import { Modal } from 'antd';
import VideoPlayer from '~/components/Common/VideoPlayer';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function TopicDetail() {
    const { topic } = useParams();
    const dispatch = useDispatch();
    const { topicIds } = useSelector(selectTopic);
    const { lessonFilter } = useSelector(selectLesson).data;
    const { ingredientFilter } = useSelector(selectIngredient).data;
    const [openTopic, setOpenTopic] = useState(false);
    const [isPlayed, setIsPlayed] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = handleSplitParam(topic);
                if (result) {
                    await dispatch(
                        getTopicId({
                            topicId: result,
                        }),
                    ).unwrap();
                    const lessonAllPromise = dispatch(getLessonAsync()).unwrap();
                    const ingredientAllPromise = dispatch(getIngredientAsync()).unwrap();

                    const [lessonAll, ingredientAll] = await Promise.all([lessonAllPromise, ingredientAllPromise]);

                    if (lessonAll) {
                        const lessonCurrents = lessonAll.filter((lesson) => {
                            return lesson?.topicId === result;
                        });
                        if (lessonCurrents) {
                            dispatch(
                                handleFilter({
                                    lessonCurrents,
                                }),
                            );
                        }
                    }

                    if (ingredientAll) {
                        const ingredientCurrents = ingredientAll.filter((ingredient) => {
                            return ingredient?.topicId === result;
                        });
                        if (ingredientCurrents) {
                            dispatch(
                                handleFillerIngredient({
                                    ingredientCurrents,
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
    }, [dispatch, topic]);

    const handleShowModal = () => {
        setOpenTopic(!openTopic);
        setIsPlayed(!openTopic);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('grid', { 'topic-detail-content': 'topic-detail-content' })}>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-8')}>
                            <div className={cx('group-title')}>
                                <Heading className={cx('heading')}>Bài viết nổi bật</Heading>
                                <div className={cx('desc')}>
                                    <p>{topicIds?.description}</p>
                                </div>
                                <div className={cx('topicList')}>
                                    <Heading className={cx('topicHeading')} h2>
                                        Nguyên liệu chuẩn bị
                                    </Heading>
                                    <section className={cx('row')}>
                                        <section className={cx('col')}>
                                            <ul className={cx('list')}>
                                                {ingredientFilter
                                                    ? ingredientFilter.map((ingredient) => (
                                                          <li key={ingredient?.ingredientsId}>
                                                              <IconCheck className={cx('icon')} size={20} />
                                                              <span>{ingredient?.ingredientsName}</span>
                                                          </li>
                                                      ))
                                                    : ''}
                                            </ul>
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
                                        style={{
                                            backgroundImage: `url("${topicIds?.topicImage}")`,
                                        }}
                                    ></div>
                                    <div className={cx('overlay')} onClick={handleShowModal}>
                                        <IconPlayerPlay size={35} stroke={3} style={{ color: '#7f56d9' }} />
                                    </div>
                                    <p>Xem giới thiệu chủ đề</p>
                                </div>

                                <h5>Miễn phí</h5>

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
