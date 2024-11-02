import { useEffect, useState, useMemo, useCallback } from 'react';
import { IconThumbUpFilled, IconThumbUp, IconBubble, IconTrash } from '@tabler/icons-react';
import { Drawer, message, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import classNames from 'classnames/bind';

import { selectComment, selectAuth } from '~/app/selectors';
import { commentPostPostsAsync, commentGetPostsAsync, removeCommentByIdAsync } from '~/app/slices/commentSlice';
import { getUserIdAsync } from '~/app/slices/userSlice';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import TextEditor from '~/components/Common/TextEditor';
import Button from '~/components/Common/Button';
import useUserInfo from '~/hooks/useUserInfo';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import * as postService from '~/services/postServices';

import styles from './Reaction.module.scss';

const cx = classNames.bind(styles);

function Reaction({ newspaperArticleId, post }) {
    const dispatch = useDispatch();
    const { content_C, commentNewsPosts } = useSelector(selectComment).data;
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const { data: userInfo } = useUserInfo(infoUserCurrent?.userId);

    const [showEditText, setShowEditText] = useState(false);
    const [userInfoMap, setUserInfoMap] = useState({});
    const [isliked, setIsLike] = useState(post.liked);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            await dispatch(commentGetPostsAsync(newspaperArticleId)).unwrap();
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, newspaperArticleId]);

    const fetchUsers = useCallback(async () => {
        const map = {};
        await Promise.all(commentNewsPosts.map(async (comment) => {
            try {
                const userInfo = await dispatch(getUserIdAsync({ userId: comment.userId })).unwrap();
                map[comment.userId] = userInfo;
            } catch (error) {}
        }));
        setUserInfoMap(map);
    }, [dispatch, commentNewsPosts]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        if (commentNewsPosts?.length > 0) {
            fetchUsers();
        }
    }, [fetchUsers, commentNewsPosts]);

    const handleLove = async () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            message.warning('Vui lòng đăng nhập để thực hiện thao tác này.');
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }
        try {
            const res = await postService.likePost(newspaperArticleId, accessToken);
            if (res.liked) {
                setIsLike(res.liked);
                post.totalLikes = res.totalLikes;
            }
            fetchComments();
        } catch (error) {}
    };

    const handleComment = async () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            message.warning('Vui lòng đăng nhập để thực hiện thao tác này.');
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }
        try {
            await dispatch(commentPostPostsAsync({ content_C, newspaperArticleId, userId: infoUserCurrent.userId })).unwrap();
            dispatch(commentGetPostsAsync(newspaperArticleId));
            setShowEditText(false);
        } catch (error) {}
    };

    const handleDeleteComment = useCallback(async (commentId) => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            message.warning('Vui lòng đăng nhập để thực hiện thao tác này.');
            setTimeout(() => window.location.href = '/login', 1000);
            return;
        }
        try {
            await dispatch(removeCommentByIdAsync({ commentId, accessToken })).unwrap();
            await dispatch(commentGetPostsAsync(newspaperArticleId)).unwrap();
            message.success('Xoá thành công!');
        } catch (error) {}
    }, [dispatch, newspaperArticleId]);

    const renderedComments = useMemo(() => {
        if (!commentNewsPosts?.length) return null;

        return commentNewsPosts.map((comment) => {
            const user = userInfoMap[comment.userId];
            const fullName = `${user?.firstName} ${user?.lastName}`;

            return (
                <div key={comment.commentId} className={cx('detailComment')}>
                    <div className={cx('avatarWrap')}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar className={cx('avatar')} linkImage={user?.image} altImage={user?.lastName ?? 'avatar'} />
                        </div>
                    </div>
                    <div className={cx('commentBody')}>
                        <div className={cx('commentInner')}>
                            <div className={cx('commentWrapper')}>
                                <div className={cx('commentContent')}>
                                    <div className={cx('commentHeading')}>
                                        <span className={cx('commentAuthor')}>{fullName}</span>
                                        {allow && comment.userId === infoUserCurrent.userId && (
                                            <Popconfirm
                                                title="Xoá Bình luận"
                                                description="Bạn có chắc muốn xoá không?"
                                                onConfirm={() => handleDeleteComment(comment.commentId)}
                                                okText="Xoá"
                                                cancelText="Không"
                                            >
                                                <IconTrash className={cx('iconRemoveComment')} />
                                            </Popconfirm>
                                        )}
                                    </div>
                                    <div className={cx('commentText')}>
                                        <MarkdownParser content_C={comment.content_C} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }, [commentNewsPosts, userInfoMap, allow, infoUserCurrent.userId, handleDeleteComment]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('btnReact')}>
                {post.totalLikes ? (
                    <>
                        <IconThumbUpFilled size={20} className={cx('active')} onClick={handleLove} />
                        <span>{post.totalLikes}</span>
                    </>
                ) : (
                    <>
                        <IconThumbUp size={20} onClick={handleLove} />
                        <span>{post.totalLikes}</span>
                    </>
                )}
            </div>
            <div className={cx('btnReact')}>
                <IconBubble size={20} onClick={() => setOpenDrawer(true)} />
                <span>{commentNewsPosts?.length ?? '0'}</span>
            </div>

            <Drawer title="Bình luận" size="large" placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                {allow && (
                    <div className={cx('commentWrapper')}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar className={cx('avatar')} linkImage={userInfo?.image ?? ''} altImage="nguyen van a" />
                        </div>
                        <div className={cx('commentContent')}>
                            {showEditText ? (
                                <>
                                    <TextEditor className={cx('textEditor')} height="280px" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                    <div className={cx('actionWrapper')}>
                                        <Button small className={cx('cancel')} onClick={() => setShowEditText(false)}>Huỷ</Button>
                                        <Button small className={cx('btnSubmit', { disabled: !content_C })} disabled={!content_C} onClick={handleComment}>Bình luận</Button>
                                    </div>
                                </>
                            ) : (
                                <div className={cx('placeholder')}>
                                    <span className={cx('comment-suggestions')} onClick={() => setShowEditText(true)}>Bạn có thắc mắc gì trong bài viết này?</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={cx('commentList')}>
                    {isLoading ? (
                        <div>Đang tải bình luận...</div>
                    ) : commentNewsPosts?.length > 0 ? (
                        <div className={cx('detailRow')}>
                            <div className={cx('container')}>{renderedComments}</div>
                        </div>
                    ) : (
                        <div className={cx('noCommentMessage')}>Không có bình luận nào.</div>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

export default Reaction;
