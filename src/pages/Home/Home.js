import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SlideShow from '~/features/slideShow';
import Heading from '~/components/Common/Heading';
import NavbarTopic from '~/components/Layouts/Components/NavbarTopic';
import Topic from '~/components/Layouts/Components/Topic';
import Button from '~/components/Common/Button';
import Introduce from '~/components/Layouts/Components/Introduce';
import PostItem from '~/components/Layouts/Components/CommonItem';

const cx = classNames.bind(styles);

function Home() {
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
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#24d198" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#00C1FF" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#F15568" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#7F56D9" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#FF6905" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#4883FF" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#F49DA8" />
                                </div>
                                <div className={cx('grid-column-3')}>
                                    <Topic colorCode="#198f51" />
                                </div>
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
