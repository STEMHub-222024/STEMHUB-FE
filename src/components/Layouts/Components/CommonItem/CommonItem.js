import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import styles from './CommonItem.module.scss';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import config from '~/config';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import { getUserIdAsync } from '~/app/slices/userSlice';

const cx = classNames.bind(styles);

function CommonItem({ data }) {
    const dispatch = useDispatch();
    const { newspaperArticleId, title, userId } = data;
    const [userInfo, setUserInfo] = useState({});

    // console.log('data', data);
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
            <div className={cx('group-images')}>
                <div className={cx('images')} style={{ backgroundImage: `url(${images.posts_1})` }}></div>
            </div>
            <div className={cx('content')}>
                <Heading className={cx('name')} h4>
                    {title}
                </Heading>
                <div className={cx('author')}>
                    <Button to={config.routes.home} className={cx('group-avatar')}>
                        <FallbackAvatar
                            className={cx('avatar')}
                            linkImage={userInfo.image ?? images.avatar_1}
                            altImage="avatar"
                        />
                        <div className={cx('info')}>
                            <span className={cx('user-name')}>{`${userInfo.firstName}`}</span>
                            <IconCircleCheckFilled size={15} className={cx('icon-check')} />
                        </div>
                    </Button>
                    <Button to={`/posts/${newspaperArticleId}`} className={cx('btn-view-post')} mainColor small>
                        View article
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CommonItem;
