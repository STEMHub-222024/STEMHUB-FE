import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconDots } from '@tabler/icons-react';
import classNames from 'classnames/bind';
import styles from './PostsDetail.module.scss';
import Button from '~/components/Common/Button';
import config from '~/config';
import Heading from '~/components/Common/Heading';
import Reaction from '~/components/Layouts/Components/Reaction';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';

import { getUserIdAsync } from '~/app/slices/userSlice';
import { getPostsByIdAsync } from '~/app/slices/postSlice';
import { selectPosts } from '~/app/selectors';

const cx = classNames.bind(styles);

function PostsDetail() {
    const { postsId } = useParams();
    const dispatch = useDispatch();
    const { post } = useSelector(selectPosts).data;
    const { title, htmlContent, userId } = post;
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(
                    getPostsByIdAsync({
                        postsId,
                    }),
                );
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();
    }, [dispatch, postsId]);

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
            <div className={cx('gird', { fullWidth: true })}>
                <div className={cx('grid-row')}>
                    <div className={cx('grid-column-3', { repositoryMarginLeft: true })}>
                        <div className={cx('aside')}>
                            <Button to={config.routes.home} text>
                                <Heading className={cx('userName')} h4>
                                    {userInfo.firstName}
                                </Heading>
                            </Button>
                            <p className={cx('userTitle')}></p>
                            <hr />
                            <Reaction />
                        </div>
                    </div>
                    <div className={cx('grid-column-9', { repositoryWith: true })}>
                        <div>
                            <Heading className={cx('heading')}>{title}</Heading>
                            <div className={cx('header')}>
                                <div className={cx('user')}>
                                    <Link to={config.routes.home}>
                                        <FallbackAvatar
                                            className={cx('avatar')}
                                            pro
                                            linkImage={userInfo.image ?? images.avatar_1}
                                            altImage="avatar"
                                        />
                                    </Link>
                                    <div className={cx('info')}>
                                        <Link to={config.routes.home}>
                                            <span className={cx('name')}>{userInfo.firstName}</span>
                                        </Link>
                                        <p className={cx('time')}>5 tháng trước</p>
                                    </div>
                                </div>
                                <div className={cx('actions')}>
                                    <Button text onClick={() => console.log('1')}>
                                        <IconDots size={20} />
                                    </Button>
                                </div>
                            </div>
                            <MarkdownParser content_C={htmlContent} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostsDetail;
