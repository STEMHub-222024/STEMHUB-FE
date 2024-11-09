import classNames from 'classnames/bind';
import Cookies from 'js-cookie';
import { message, Popconfirm } from 'antd';
import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import Loading from '~/components/Common/Loading';
import styles from './Comment.module.scss';
import CommentBox from '~/components/Layouts/Components/CommentBox';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import { handleSplitParam } from '~/utils/splitParamUrl';
import { useDispatch, useSelector } from 'react-redux';
import { commentGetIdLessonAsync, removeCommentByIdAsync } from '~/app/slices/commentSlice';
import { getUserIdAsync } from '~/app/slices/userSlice';
import { selectComment, selectAuth } from '~/app/selectors';
import { handleRefreshToken } from '~/utils/checkCookieExists';

const cx = classNames.bind(styles);

const Comment = memo(() => {
    const { lessonId } = useParams();
    const newLessonId = handleSplitParam(lessonId);
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const { commentByLessonIds = [] } = useSelector(selectComment).filter;
    const [userInfoMap, setUserInfoMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                await dispatch(commentGetIdLessonAsync({ newLessonId })).unwrap();
            } catch (error) {
                message.error('Lỗi khi tải bình luận.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [dispatch, newLessonId]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userIds = commentByLessonIds.map(comment => comment.userId);
            const uniqueUserIds = [...new Set(userIds)];
            const userPromises = uniqueUserIds.map(userId => 
                dispatch(getUserIdAsync({ userId })).unwrap()
            );

            const users = await Promise.all(userPromises);
            const userMap = uniqueUserIds.reduce((acc, userId, index) => {
                acc[userId] = users[index];
                return acc;
            }, {});
            setUserInfoMap(userMap);
        };

        if (commentByLessonIds.length > 0) {
            fetchUsers();
        }
    }, [dispatch, commentByLessonIds]);

    const confirm = useCallback((commentId) => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        if (accessToken) {
            dispatch(removeCommentByIdAsync({ commentId, accessToken }));
            message.success('Xoá thành công!');
        } else  if(refreshToken) {
            handleRefreshToken(dispatch);
        } else {
            message.warning('Vui lòng đăng nhập để thực hiện thao tác này.');
        }
    }, [dispatch]);

    const renderedComments = useMemo(() => {
        return commentByLessonIds.map((comment) => {
            const user = userInfoMap[comment.userId];
            return (
                <div key={comment.commentId} className={cx('detailComment')}>
                    <div className={cx('avatarWrap')}>
                        <FallbackAvatar
                            className={cx('avatar')}
                            linkImage={user?.image ?? ''}
                            altImage={user?.lastName ?? 'avatar'}
                        />
                    </div>
                    <div className={cx('commentBody')}>
                        <div className={cx('commentInner')}>
                            <div className={cx('commentWrapper')}>
                                <div className={cx('commentContent')}>
                                    <div className={cx('commentHeading')}>
                                        <span className={cx('commentAuthor')}>
                                            {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                                        </span>
                                        {allow && comment.userId === infoUserCurrent.userId && (
                                            <Popconfirm
                                                title="Xoá Bình luận"
                                                description="Bạn có chắc muốn xoá không?"
                                                onConfirm={() => confirm(comment.commentId)}
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
    }, [commentByLessonIds, userInfoMap, allow, infoUserCurrent.userId, confirm]);

    return (
        <div className={cx('detailRow')}>
            {allow && <CommentBox commentByLessonIds={commentByLessonIds} />}
            <div className={cx('container')}>
                {isLoading ? (
                    <Loading />
                ) : commentByLessonIds.length > 0 ? (
                    renderedComments
                ) : (
                    <div className={cx('noCommentMessage')}>Không có bình luận nào.</div>
                )}
            </div>
        </div>
    );
});

export default Comment;
