import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConvertString from '~/hooks/useConvertString';
import tinycolor from 'tinycolor2';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SlideShow from '~/components/Common/SlideShow';
import Heading from '~/components/Common/Heading';
import NavbarTopic from '~/components/Layouts/Components/NavbarTopic';
import Topic from '~/components/Layouts/Components/Topic';
import Button from '~/components/Common/Button';
import Introduce from '~/components/Layouts/Components/Introduce';
import PostItem from '~/components/Layouts/Components/CommonItem';
import { getOutstanding } from '~/app/slices/topicSlice';
import { getPostsAsync } from '~/app/slices/postSlice';
import { getStemAsync, handleOnClickStem } from '~/app/slices/navbarTopicSlice';
import { selectTopic, selectNavbarTopic, selectPosts } from '~/app/selectors';
import Loading from '~/components/Common/Loading';
import config from '~/config';

const cx = classNames.bind(styles);

const checkStemDefault = (stemName, defaultValue) => {
    const normalizedStemName = stemName.replace(/\s+/g, '').toUpperCase();
    const normalizedDefaultValue = defaultValue.replace(/\s+/g, '').toUpperCase();
    const isDefaultMatch = normalizedStemName.includes(normalizedDefaultValue);
    return { upperCaseName: normalizedStemName, isDefaultMatch };
};

function Home() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { showOutstanding } = useSelector(selectTopic);
    const { isOnClickStem } = useSelector(selectNavbarTopic);
    const posts = useSelector(selectPosts)?.data?.posts || [];
    const convertedString = useConvertString(isOnClickStem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stemResult = await dispatch(getStemAsync()).unwrap();
                const defaultStem = stemResult.find(
                    (stem) => checkStemDefault(stem.stemName, stem.stemName)?.isDefaultMatch,
                );

                if (defaultStem) {
                    await dispatch(getOutstanding({ stemId: defaultStem.stemId })).unwrap();
                    dispatch(handleOnClickStem({ stemName: defaultStem.stemName }));
                }

                await dispatch(getPostsAsync()).unwrap();
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    const topicColors = useMemo(() => showOutstanding?.map(() => tinycolor.random().toString()), [showOutstanding]);

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
                                Chủ Đề <span>Nổi Bật</span>
                            </Heading>
                            <NavbarTopic checkStemDefault={checkStemDefault} />
                        </header>
                        <div className={cx('topic-content')}>
                            <div className={cx('grid-row')}>
                                {showOutstanding?.map((shine, index) => (
                                    <div key={shine.topicId} className={cx('grid-column-3')}>
                                        <Topic colorCode={topicColors[index]} shine={shine} />
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
                    <div className={cx('grid-row')}>
                        {posts.map((post) => (
                            <div key={post.newspaperArticleId} className={cx('grid-column-3')}>
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
