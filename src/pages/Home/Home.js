import PropTypes from 'prop-types';
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

// Service
import { useEffect } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { getOutstanding } from '~/components/Layouts/Components/Topic/topicSlice';
import { selectTopic } from '~/app/selectors';
const controller = new AbortController();

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const { showOutstanding } = useSelector(selectTopic);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getOutstanding()).unwrap();
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);
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
                            <NavbarTopic />
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
                                        <Button mainColor borderMedium medium>
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
                        <div className={cx('grid-column-3')}>
                            <PostItem />
                        </div>
                        <div className={cx('grid-column-3')}>
                            <PostItem />
                        </div>
                        <div className={cx('grid-column-3')}>
                            <PostItem />
                        </div>
                        <div className={cx('grid-column-3')}>
                            <PostItem />
                        </div>
                    </div>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-12')}>
                            <div className={cx('btn-explore-all')}>
                                <Button mainColor borderMedium medium>
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

Home.propTypes = {};

export default Home;
