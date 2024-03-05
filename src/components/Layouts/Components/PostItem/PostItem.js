import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconCircleCheckFilled, IconDots } from '@tabler/icons-react';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import Button from '~/components/Common/Button';
import config from '~/config';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Image from '~/components/Common/Image';

import classNames from 'classnames/bind';
import styles from './PostItem.module.scss';

const cx = classNames.bind(styles);

function PostItem({ data }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('author')}>
                    <Button to={config.routes.postsDetail} className={cx('group-avatar')}>
                        <FallbackAvatar className={cx('avatar')} linkImage={images.avatar_1} altImage="avatar" />
                        <div className={cx('info')}>
                            <span className={cx('user-name')}>duc nguyen</span>
                            <IconCircleCheckFilled size={15} className={cx('icon-check')} />
                        </div>
                    </Button>
                </div>
                <div className={cx('actions')}>
                    <Button text onClick={() => console.log('1')}>
                        <IconDots size={20} />
                    </Button>
                </div>
            </div>

            <div className={cx('body')}>
                <div className={cx('content')}>
                    <Link to={config.routes.postsDetail}>
                        <Heading h2 className={cx('title')}>
                            {data.title}
                        </Heading>
                    </Link>
                    <p className={cx('desc')}>{data.desc}</p>
                </div>
                <div className={cx('thumb')}>
                    <Link to={config.routes.home}>
                        <Image
                            className={cx('image')}
                            src={data.image}
                            alt="Authentication & Authorization trong ReactJS"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
