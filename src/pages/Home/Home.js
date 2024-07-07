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

// Services
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOutstanding } from '~/app/slices/topicSlice';
import { getPostsAsync } from '~/app/slices/postSlice';
import { getStemAsync, handleOnClickStem } from '~/app/slices/navbarTopicSlice';
import { selectTopic, selectNavbarTopic, selectPosts } from '~/app/selectors';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import config from '~/config';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const { showOutstanding } = useSelector(selectTopic);
    const { isOnClickStem } = useSelector(selectNavbarTopic);
    const { posts } = useSelector(selectPosts).data;

    useEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dispatch(getStemAsync()).unwrap();

                const defaultStem = result?.find((stem) => {
                    const activeDefault = checkStemDefault(stem?.stemName, stem?.stemName);
                    return activeDefault?.stemDefault;
                });
                if (defaultStem) {
                    await dispatch(
                        getOutstanding({
                            stemId: defaultStem?.stemId,
                        }),
                    ).unwrap();
                    dispatch(
                        handleOnClickStem({
                            stemName: defaultStem?.stemName,
                        }),
                    );
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                dispatch(getPostsAsync());
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();
    }, [dispatch]);

    const checkStemDefault = (stemName, defaultValue) => {
        const upperCaseName = stemName.toUpperCase();
        const stemDefault = stemName.includes(defaultValue);
        if (stemDefault) {
            return {
                upperCaseName,
                stemDefault,
            };
        } else {
            return {
                upperCaseName,
            };
        }
    };

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
                        {/*Header  */}
                        <header className={cx('topic-header')}>
                            <Heading h2 className={cx('title')}>
                                Our Most <span>Popular Topic</span>
                            </Heading>
                            <NavbarTopic checkStemDefault={checkStemDefault} />
                        </header>
                        {/* Topic */}
                        <div className={cx('topic-content')}>
                            <div className={cx('grid-row')}>
                                {showOutstanding?.map((shine) => {
                                    const randomColor = tinycolor.random().toString();
                                    return (
                                        <div key={shine.topicId} className={cx('grid-column-3')}>
                                            <Topic colorCode={randomColor} shine={shine} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={cx('grid-row')}>
                                <div className={cx('grid-column-12')}>
                                    <div className={cx('btn-explore-all')}>
                                        <Button mainColor borderMedium medium to={`/${isOnClickStem}`}>
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
                {/* POSTS */}
                <div className={cx('posts-content')}>
                    <div className={cx('grid-row')}>
                        {posts &&
                            posts.map((post) => (
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

export default Home;
