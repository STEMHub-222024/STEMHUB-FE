import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConvertString from '~/hooks/useConvertString';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SlideShow from '~/components/Common/SlideShow';
import Heading from '~/components/Common/Heading';
import Topic from '~/components/Layouts/Components/Topic';
import Button from '~/components/Common/Button';
import Introduce from '~/components/Layouts/Components/Introduce';
import PostItem from '~/components/Layouts/Components/CommonItem';
import { getTopicTop4 } from '~/app/slices/topicSlice';
import { getPostsAsync } from '~/app/slices/postSlice';
import { selectTopic, selectNavbarTopic, selectPosts } from '~/app/selectors';
import Loading from '~/components/Common/Loading';
import config from '~/config';

const cx = classNames.bind(styles);


function Home() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { topicTop4 } = useSelector(selectTopic);
    const { isOnClickStem } = useSelector(selectNavbarTopic);
    const posts = useSelector(selectPosts)?.data?.posts || [];
    const convertedString = useConvertString(isOnClickStem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.allSettled([
                    dispatch(getTopicTop4()).unwrap(),
                    dispatch(getPostsAsync()).unwrap()
                ]);

            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    if (loading) {
        return <Loading title="Đang tải...." />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slideshow')}>
                <section className={cx('slideshow-wrapper')}>
                    <SlideShow />
                </section>
            </div>
            <div className={cx('container', 'grid')}>
                <div className={cx('topic-group', 'grid-row')}>
                    <div className={cx('grid-column-12')}>
                        <header className={cx('topic-header')}>
                            <Heading h2 className={cx('title')}>
                                Chủ đề <span>nổi bật</span>
                            </Heading>
                        </header>
                        <div className={cx('topic-content')}>
                            <div className={cx('grid-row')}>
                                {topicTop4?.map((shine, index) => (
                                    <div key={shine.topicId} className={cx('grid-column-3')}>
                                        <Topic shine={shine} />
                                    </div>
                                ))}
                            </div>
                            <div className={cx('grid-row')}>
                                <div className={cx('grid-column-12')}>
                                    <div className={cx('btn-explore-all')}>
                                        <Button mainColor borderMedium medium to={`/${convertedString}`}>
                                            Khám phá chủ đề
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('introduce', 'grid-row')}>
                    <Introduce />
                </div>
                <div className={cx('posts-content')}>
                    <header className={cx('posts-header')}>
                        <Heading h2 className={cx('title')}>
                            Bài viết <span>nổi bật</span>
                        </Heading>
                    </header>
                    <div className={cx('grid-row')}>
                        {posts.map((post) => (
                            <div key={post?.article?.newspaperArticleId} className={cx('grid-column-3')}>
                                <PostItem data={post} />
                            </div>
                        ))}
                    </div>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-12')}>
                            <div className={cx('btn-explore-all')}>
                                <Button to={config.routes.posts} mainColor borderMedium medium>
                                    Khám phá bài viết
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Home);
