import classNames from 'classnames/bind';
import { IconBrain, IconBackpack, IconBulb } from '@tabler/icons-react';
import styles from './Introduce.module.scss';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';

const cx = classNames.bind(styles);

function Introduce() {
    return (
        <>
            <div className={cx('grid-column-5')}>
                <div className={cx('wrap-avatar')}>
                    <div className={cx('group-background-left')}>
                        <div className={cx('background-top-left')}>
                            <div
                                className={cx('image-top-left')}
                                style={{ backgroundImage: `url(${images.introduce_2})` }}
                            ></div>
                        </div>
                        <div className={cx('background-bottom-left')}>
                            <div
                                className={cx('image-bottom-left')}
                                style={{ backgroundImage: `url(${images.introduce_3})` }}
                            ></div>
                        </div>
                    </div>
                    <div className={cx('background-main')}>
                        <div
                            className={cx('image-main')}
                            style={{ backgroundImage: `url(${images.introduce_1})` }}
                        ></div>
                    </div>

                    <div className={cx('group-background-right')}>
                        <div className={cx('background-top-right')}>
                            <div
                                className={cx('image-top-right')}
                                style={{ backgroundImage: `url(${images.introduce_4})` }}
                            ></div>
                        </div>
                        <div className={cx('background-bottom-right')}>
                            <div
                                className={cx('image-bottom-right')}
                                style={{ backgroundImage: `url(${images.introduce_5})` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('grid-column-7')}>
                <div className={cx('wrap-content')}>
                    <Heading h2 className={cx('title')}>
                        The number one factor in<span> relevance drives out resistance.</span>
                    </Heading>
                    <div className={cx('criteria')}>
                        <div className={cx('criteria-item')}>
                            <IconBrain size={20} color="#f1bf5a" />
                            <span>Public Speaking</span>
                        </div>
                        <div className={cx('criteria-item')}>
                            <IconBackpack size={20} color="#f1bf5a" />
                            <span>Public Speaking</span>
                        </div>
                        <div className={cx('criteria-item')}>
                            <IconBulb size={20} color="#f1bf5a" />
                            <span>Public Speaking</span>
                        </div>
                    </div>
                    <p className={cx('context')}>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                    </p>

                    <div className={cx('action')}>
                        <Button className={cx('btn-title')} mainColor small>
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Introduce;
