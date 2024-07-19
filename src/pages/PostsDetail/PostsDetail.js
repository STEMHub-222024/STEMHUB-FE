import classNames from 'classnames/bind';
import { useEffect, useMemo, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconDots } from '@tabler/icons-react';
import { getPostsByIdAsync } from '~/app/slices/postSlice';
import { selectPosts } from '~/app/selectors';
import useUserInfo from '~/hooks/useUserInfo';
import styles from './PostsDetail.module.scss';
import Button from '~/components/Common/Button';
import config from '~/config';
import Heading from '~/components/Common/Heading';
import Reaction from '~/components/Layouts/Components/Reaction';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import Loading from '~/components/Common/Loading';
import formatDateToNow from '~/utils/formatDateToNow';

const cx = classNames.bind(styles);

const UserInfo = memo(({ fullName, Component, className, h4 }) => (
    <Component className={cx(className)} h4={h4}>
        {fullName}
    </Component>
));

function PostsDetail() {
    const { postsId } = useParams();
    const dispatch = useDispatch();
    const { post } = useSelector(selectPosts).data;
    const { title, htmlContent, userId, create_at } = post || {};
    const { data: userInfo, isLoading } = useUserInfo(userId);

    useEffect(() => {
        dispatch(getPostsByIdAsync({ postsId }));
    }, [dispatch, postsId]);

    const fullName = useMemo(
        () => (userInfo ? `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() : ''),
        [userInfo],
    );

    if (isLoading) return <Loading />;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('gird', { fullWidth: true })}>
                <div className={cx('grid-row')}>
                    <div className={cx('grid-column-3', { repositoryMarginLeft: true })}>
                        <div className={cx('aside')}>
                            <div style={{ textAlign: 'center' }}>
                                <UserInfo fullName={fullName} Component={Heading} className="userName" h4 />
                            </div>
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
                                            linkImage={userInfo?.image || ''}
                                            altImage="avatar"
                                        />
                                    </Link>
                                    <div className={cx('info')}>
                                        <Link to={config.routes.home}>
                                            <UserInfo fullName={fullName} Component={'span'} className="name" />
                                        </Link>
                                        <p className={cx('time')}>{create_at && formatDateToNow(create_at)}</p>
                                    </div>
                                </div>
                                <div className={cx('actions')}>
                                    <Button text>
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
