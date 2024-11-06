import classNames from 'classnames/bind';
import { useEffect, useMemo, memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconDots, IconShare } from '@tabler/icons-react';
import Tippy from '@tippyjs/react/headless';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';
import { message } from 'antd';
import { getPostsByIdAsync } from '~/app/slices/postSlice';
import { selectPosts } from '~/app/selectors';
import useUserInfo from '~/hooks/useUserInfo';
import styles from './PostsDetail.module.scss';
import Button from '~/components/Common/Button';
import Heading from '~/components/Common/Heading';
import Reaction from '~/components/Layouts/Components/Reaction';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import Loading from '~/components/Common/Loading';
import formatDateToNow from '~/utils/formatDateToNow';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

const UserInfo = memo(({ fullName, Component, className, h4 }) => (
    <Component className={cx(className)} h4={h4}>
        {fullName}
    </Component>
));

function PostsDetail() {
    const { postsId } = useParams();
    const dispatch = useDispatch();
    const { post } = useSelector(selectPosts)?.data || {};
    const { title, htmlContent, userId, create_at, description_NA, image } = post.article || {};
    const { data: userInfo, isLoading } = useUserInfo(userId);
    const [showShare, setShowShare] = useState(false);
    const shareUrl = window.location.href;

    useEffect(() => {
        if (postsId) {
            const accessToken = Cookies.get('accessToken');
            dispatch(getPostsByIdAsync({ postsId, accessToken }));
        }
    }, [dispatch, postsId]);

    const fullName = useMemo(() => {
        return userInfo ? `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() : '';
    }, [userInfo]);

    const handleToggleShare = () => setShowShare(prev => !prev);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        message.success('Đã sao chép liên kết!');
        setShowShare(false);
    };

    const [loadingDelay, setLoadingDelay] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoadingDelay(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loadingDelay || isLoading || !post.article) return <Loading title="Đang tải...." />;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid', { fullWidth: true })}>
                <div className={cx('grid-row')}>
                    <div className={cx('grid-column-3', { repositoryMarginLeft: true })}>
                        <div className={cx('aside')}>
                            <div style={{ textAlign: 'center' }}>
                                <UserInfo fullName={fullName} Component={Heading} className="userName" h4 />
                            </div>
                            <hr />
                            <Reaction newspaperArticleId={postsId} post={post} />
                        </div>
                    </div>
                    <div className={cx('grid-column-9', { repositoryWith: true })}>
                        <article>
                            <Heading className={cx('heading')}>{title}</Heading>
                            <div className={cx('header')}>
                                <div className={cx('user')}>
                                    <span>
                                        <FallbackAvatar
                                            className={cx('avatar')}
                                            pro
                                            linkImage={userInfo?.image || ''}
                                            altImage="avatar"
                                        />
                                    </span>
                                    <div className={cx('info')}>
                                        <span>
                                            <UserInfo fullName={fullName} Component={'span'} className="name" />
                                        </span>
                                        <p className={cx('time')}>{create_at && formatDateToNow(create_at)}</p>
                                    </div>
                                </div>
                                <div className={cx('actions')}>
                                    <Tippy
                                        interactive
                                        visible={showShare}
                                        placement="bottom-end"
                                        render={(attrs) => (
                                            <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                                                <FacebookShareButton
                                                    url={shareUrl}
                                                    title={title}
                                                    description={description_NA}
                                                    hashtag="#stempost"
                                                    picture={image}
                                                >
                                                    <div className={cx('menu-item')}>
                                                        <div className={cx('menu-icon')}>
                                                            <FacebookIcon size={20} round />
                                                        </div>
                                                        <span className={cx('menu-text')}>Chia sẻ lên Facebook</span>
                                                    </div>
                                                </FacebookShareButton>

                                                <TwitterShareButton
                                                    url={shareUrl}
                                                    title={title}
                                                    hashtags={['stempost']}
                                                    via="STEMPost"
                                                    media={image}
                                                >
                                                    <div className={cx('menu-item')}>
                                                        <div className={cx('menu-icon')}>
                                                            <TwitterIcon size={20} round />
                                                        </div>
                                                        <span className={cx('menu-text')}>Chia sẻ lên Twitter</span>
                                                    </div>
                                                </TwitterShareButton>

                                                <LinkedinShareButton
                                                    url={shareUrl}
                                                    title={title}
                                                    summary={description_NA}
                                                    source="STEMPost"
                                                    media={image}
                                                >
                                                    <div className={cx('menu-item')}>
                                                        <div className={cx('menu-icon')}>
                                                            <LinkedinIcon size={20} round />
                                                        </div>
                                                        <span className={cx('menu-text')}>Chia sẻ lên LinkedIn</span>
                                                    </div>
                                                </LinkedinShareButton>

                                                <div className={cx('menu-item')} onClick={handleCopyLink}>
                                                    <div className={cx('menu-icon')}>
                                                        <IconShare size={20} />
                                                    </div>
                                                    <span className={cx('menu-text')}>Sao chép liên kết</span>
                                                </div>
                                            </div>
                                        )}
                                        onClickOutside={() => setShowShare(false)}
                                    >
                                        <div onClick={handleToggleShare}>
                                            <Button text>
                                                <IconDots size={20} />
                                            </Button>
                                        </div>
                                    </Tippy>
                                </div>
                            </div>
                            <MarkdownParser content_C={htmlContent} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(PostsDetail);