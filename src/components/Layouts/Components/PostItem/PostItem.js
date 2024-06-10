import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IconCircleCheckFilled, IconDots } from '@tabler/icons-react';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import Button from '~/components/Common/Button';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Image from '~/components/Common/Image';
import { getUserIdAsync } from '~/app/slices/userSlice';

import classNames from 'classnames/bind';
import styles from './PostItem.module.scss';

const cx = classNames.bind(styles);

function PostItem({ data }) {
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({});
    const { userId } = data;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const info = await dispatch(
                    getUserIdAsync({
                        userId,
                    }),
                ).unwrap();
                if (info) setUserInfo(info);
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };

        fetchUsers();
    }, [dispatch, userId]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('author')}>
                    <Button to={`/posts/${data.newspaperArticleId}`} className={cx('group-avatar')}>
                        <FallbackAvatar
                            className={cx('avatar')}
                            linkImage={userInfo.image ?? images.avatar_1}
                            altImage="avatar"
                        />
                        <div className={cx('info')}>
                            <span className={cx('user-name')}>{userInfo?.firstName}</span>
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
                    <Link to={`/posts/${data.newspaperArticleId}`}>
                        <Heading h2 className={cx('title')}>
                            {data.title}
                        </Heading>
                    </Link>
                    <p className={cx('desc')}></p>
                </div>
                <div className={cx('thumb')}>
                    <Link to={`/posts/${data.newspaperArticleId}`}>
                        <Image
                            className={cx('image')}
                            src={data.image ?? images.posts_2}
                            alt="Authentication & Authorization trong ReactJS"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
