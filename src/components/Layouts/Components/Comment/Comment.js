import classNames from 'classnames/bind';
import Cookies from 'js-cookie';
import { message, Popconfirm } from 'antd';
import { useEffect, useLayoutEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';

import styles from './Comment.module.scss';
import CommentBox from '~/components/Layouts/Components/CommentBox';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import { handleSplitParam } from '~/utils/splitParamUrl';
//Service
import { useDispatch, useSelector } from 'react-redux';
import { commentGetIdLessonAsync, removeCommentByIdAsync } from '~/app/slices/commentSlice';
import { getUserIdAsync } from '~/app/slices/userSlice';
import { selectComment } from '~/app/selectors';

// Check Auth
import { selectAuth } from '~/app/selectors';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Comment() {
    const { lessonId } = useParams();
    const newLessonId = handleSplitParam(lessonId);
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const { commentByLessonIds } = useSelector(selectComment).filter;
    const [userInfoMap, setUserInfoMap] = useState({});
    const [resetToken, setIsResetToken] = useState(false);

    useLayoutEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch, resetToken]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                await dispatch(commentGetIdLessonAsync({ newLessonId, signal: controller.signal })).unwrap();
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };

        fetchComments();
    }, [dispatch, newLessonId]);

    useEffect(() => {
        if (commentByLessonIds.length > 0) {
            const fetchUsers = async () => {
                const map = {};
                for (const comment of commentByLessonIds) {
                    try {
                        const userInfo = await dispatch(
                            getUserIdAsync({
                                userId: comment.userId,
                            }),
                        ).unwrap();
                        map[comment.userId] = userInfo;
                    } catch (rejectedValueOrSerializedError) {
                        console.error(rejectedValueOrSerializedError);
                    }
                }
                setUserInfoMap(map);
            };

            fetchUsers();
        }
    }, [dispatch, commentByLessonIds]);

    function checkCookieExists(cookieName) {
        return !!Cookies.get(cookieName);
    }

    const confirm = (commentId) => {
        if (checkCookieExists('accessToken')) {
            const accessToken = Cookies.get('accessToken');
            dispatch(removeCommentByIdAsync({ commentId, accessToken }));
            message.success('Xoá thành công!');
        } else {
            setIsResetToken(!resetToken);
        }
    };
    return (
        <div className={cx('detailRow')}>
            <>
                {allow && <CommentBox commentByLessonIds={commentByLessonIds} />}
                <div className={cx('container')}>
                    {commentByLessonIds && commentByLessonIds.length > 0
                        ? commentByLessonIds.map((comment) => {
                              const user = userInfoMap[comment.userId];
                              return (
                                  <div key={comment.commentId} className={cx('detailComment')}>
                                      <div className={cx('avatarWrap')}>
                                          <div>
                                              <div className={cx('avatarWrapper')}>
                                                  <FallbackAvatar
                                                      className={cx('avatar')}
                                                      linkImage={user?.image}
                                                      altImage={user?.lastName ?? 'avatar'}
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                      <div className={cx('commentBody')}>
                                          <div className={cx('commentInner')}>
                                              <div className={cx('commentWrapper')}>
                                                  <div className={cx('commentContent')}>
                                                      <div className={cx('commentHeading')}>
                                                          <div>
                                                              <span
                                                                  className={cx('commentAuthor')}
                                                              >{`${user?.firstName} ${user?.lastName}`}</span>
                                                          </div>
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
                                                  <div className={cx('commentTime')}>
                                                      <div className={cx('createdAt')}>
                                                          <div className={cx('createdAtLeft')}>
                                                              <button className={cx('iconWrapper')}>
                                                                  <span className={cx('likeComment')}>Thích</span>
                                                              </button>
                                                              <span className={cx('replyComment')}>Trả lời</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : ''}
                </div>
            </>
        </div>
    );
}

export default memo(Comment);
