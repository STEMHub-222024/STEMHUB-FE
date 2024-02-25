import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import styles from './Topic.module.scss';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';

const cx = classNames.bind(styles);

function Topic({ colorCode }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('images')} style={{ backgroundImage: `url(${images.topic_5})` }} />
            <div className={cx('content')}>
                <Heading className={cx('name')} h4>
                    Python for Financial Analysis Next and Algorithmic Trading
                </Heading>
                <div className={cx('group-action')}>
                    <div className={cx('video-number')}>
                        <div className={cx('wrapper-icon')} style={{ backgroundColor: colorCode }}>
                            <IconPlayerPlayFilled size={12} className={cx('play-icon')} />
                        </div>
                        <span className={cx('title')}>25x Lesson</span>
                    </div>

                    <Button mainColor small style={{ backgroundColor: colorCode, borderColor: colorCode }}>
                        Join
                    </Button>
                </div>
            </div>
        </div>
    );
}

Topic.propTypes = {
    colorCode: PropTypes.string,
};

export default Topic;
