import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import { IconCircleCheckFilled, IconEyeFilled, IconThumbUpFilled, IconBubbleFilled } from '@tabler/icons-react';
import styles from './CommonItem.module.scss';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import config from '~/config';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import useUserInfo from '~/hooks/useUserInfo';

const cx = classNames.bind(styles);

function CommonItem({ data }) {
    const { newspaperArticleId, title, userId, image } = data;
    const { data: userInfo } = useUserInfo(userId);

    const encodedImageUrl = useMemo(() => {
        return image ? (image.includes(' ') ? image.replace(/ /g, '%20') : image) : '';
    }, [image]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('group-images')}>
                <div className={cx('images')} style={{ backgroundImage: `url(${encodedImageUrl})` }}></div>
            </div>
            <div className={cx('content')}>
                <Heading className={cx('name')} h4>
                    {title}
                </Heading>
                <div className={cx('author')}>
                    <Button to={config.routes.home} className={cx('group-avatar')}>
                        {userInfo ? (
                            <div className={cx('personal')}>
                                <FallbackAvatar className={cx('avatar')} linkImage={userInfo.image} altImage="avatar" />
                                <div className={cx('info')}>
                                    <span className={cx('user-name')}>
                                        {userInfo.firstName || userInfo.lastName
                                            ? `${userInfo.firstName} ${userInfo.lastName}`
                                            : ''}
                                    </span>
                                    <IconCircleCheckFilled size={15} className={cx('icon-check')} />
                                </div>
                            </div>
                        ) : (
                            <div>Đang tải...</div>
                        )}
                    </Button>
                </div>
                <div className={cx('group-button')}>
                    <div className={cx('btn-bookmark')}>
                        <IconEyeFilled size={20} />
                        <span>2</span>
                    </div>
                    <div className={cx('btn-share')}>
                        <IconThumbUpFilled size={20} />
                        <span>61</span>
                    </div>
                    <div className={cx('btn-like')}>
                        <IconBubbleFilled size={20} />
                        <span>236</span>
                    </div>
                </div>
                <div>
                    <Button to={`/posts/${newspaperArticleId}`} mainColor small>
                        Xem bài viết
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(CommonItem);
