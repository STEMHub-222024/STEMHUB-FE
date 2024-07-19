import React, { useEffect, useMemo } from 'react';
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
import config from '~/config';

const cx = classNames.bind(styles);

const checkStemDefault = (stemName, defaultValue) => {
    const upperCaseName = stemName.toUpperCase();
    if (!(defaultValue instanceof RegExp)) {
        const stemDefault = stemName.includes(defaultValue);
        return stemDefault ? { upperCaseName, stemDefault } : { upperCaseName };
    }
    const stemDefault = defaultValue.test(stemName);
    return stemDefault ? { upperCaseName, stemDefault } : { upperCaseName };
};

function Home() {
    const dispatch = useDispatch();
    const { showOutstanding } = useSelector(selectTopic);
    const { isOnClickStem } = useSelector(selectNavbarTopic);
    const { posts } = useSelector(selectPosts).data;
    const convertedString = useConvertString(isOnClickStem);

    useEffect(() => {
        const controller = new AbortController();

        const fetchApi = async () => {
            try {
                const result = await dispatch(getStemAsync()).unwrap();

                const defaultStem = result?.find((stem) => {
                    const activeDefault = checkStemDefault(stem?.stemName, stem?.stemName);
                    return activeDefault?.stemDefault;
                });
                if (defaultStem) {
                    await dispatch(getOutstanding({ stemId: defaultStem?.stemId })).unwrap();
                    dispatch(handleOnClickStem({ stemName: defaultStem?.stemName }));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                await dispatch(getPostsAsync()).unwrap();
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, [dispatch]);

    const topicColors = useMemo(() => showOutstanding?.map(() => tinycolor.random().toString()), [showOutstanding]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slideshow')}>
                <section className={cx('slideshow-wrapper')}>
                    <SlideShow />
                </section>
            </div>
            <div className={cx('container', { grid: 'grid' })}>
                <div className={cx('topic-group', { 'grid-row': 'grid-row' })}>
                    <div className={cx('grid-column-12')}>
                        <header className={cx('topic-header')}>
                            <Heading h2 className={cx('title')}>
                                Our Most <span>Popular Topic</span>
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
                                            Explore all Topic
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('introduce', { 'grid-row': 'grid-row' })}>
                    <Introduce />
                </div>
                <div className={cx('posts-content')}>
                    <div className={cx('grid-row')}>
                        {posts?.map((post) => (
                            <div key={post.newspaperArticleId} className={cx('grid-column-3')}>
                                <PostItem data={post} />
                            </div>
                        ))}
                    </div>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-12')}>
                            <div className={cx('btn-explore-all')}>
                                <Button to={config.routes.posts} mainColor borderMedium medium>
                                    Explore all Posts
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
