import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import Button from '~/components/Common/Button';
import Heading from '~/components/Common/Heading';
import Image from '~/components/Common/Image';
import useUserInfo from '~/hooks/useUserInfo';

import classNames from 'classnames/bind';
import styles from './PostItem.module.scss';

const cx = classNames.bind(styles);

function PostItem({ data }) {
    const { userId, newspaperArticleId, title, description_NA, image } = data.article;
    const { data: userInfo } = useUserInfo(userId);

    const userName = useMemo(() => {
        if (userInfo) {
            return `${userInfo.firstName} ${userInfo.lastName}`;
        }
        return '';
    }, [userInfo]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('author')}>
                    <Button to={`/posts/${newspaperArticleId}`} className={cx('group-avatar')}>
                        <FallbackAvatar className={cx('avatar')} linkImage={userInfo?.image} altImage="avatar" />
                        <div className={cx('info')}>
                            <span className={cx('user-name')}>{userName}</span>
                            {userInfo && <IconCircleCheckFilled size={15} className={cx('icon-check')} />}
                        </div>
                    </Button>
                </div>
            </div>

            <div className={cx('body')}>
                <div className={cx('content')}>
                    <Link to={`/posts/${newspaperArticleId}`}>
                        <Heading h2 className={cx('title')}>
                            {title}
                        </Heading>
                    </Link>
                    <p className={cx('desc')}>{description_NA}</p>
                </div>
                <div className={cx('thumb')}>
                    <Link to={`/posts/${newspaperArticleId}`}>
                        <Image className={cx('image')} src={image} alt={title} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default memo(PostItem);
