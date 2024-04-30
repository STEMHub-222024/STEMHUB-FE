import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './Comment.module.scss';
import CommentBox from '~/components/Layouts/Components/CommentBox';
import config from '~/config';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';

//Service
import { useDispatch, useSelector } from 'react-redux';
import { commentGetIdLessonAsync } from '~/app/slices/commentSlice';
import { selectComment } from '~/app/selectors';
//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Comment({ lessonId }) {
    const dispatch = useDispatch();
    const { commentByLessonIds } = useSelector(selectComment).filter;

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(commentGetIdLessonAsync({ lessonId })).unwrap();
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch, lessonId]);

    // console.log('commentByLessonIds', commentByLessonIds);

    return (
        <div className={cx('detailRow')}>
            <CommentBox commentByLessonIds={commentByLessonIds} />
            <div className={cx('container')}>
                {commentByLessonIds
                    ? commentByLessonIds.map((comment) => {
                          // try {
                          //     const comments = dispatch(
                          //         commentGetIdAsync({
                          //             commentId: comment.userId,
                          //         }),
                          //     ).unwrap();
                          //     console.log('comments', comments);
                          // } catch (rejectedValueOrSerializedError) {
                          //     console.error(rejectedValueOrSerializedError);
                          // }
                          return (
                              <div key={comment.commentId} className={cx('detailComment')}>
                                  <div className={cx('avatarWrap')}>
                                      <Link to={config.routes.home}>
                                          <div className={cx('avatarWrapper')}>
                                              <FallbackAvatar
                                                  className={cx('avatar')}
                                                  linkImage={images.avatar_1}
                                                  altImage="nguyen van a"
                                              />
                                          </div>
                                      </Link>
                                  </div>
                                  <div className={cx('commentBody')}>
                                      <div className={cx('commentInner')}>
                                          <div className={cx('commentWrapper')}>
                                              <div className={cx('commentContent')}>
                                                  <div className={cx('commentHeading')}>
                                                      <Link to={config.routes.home}>
                                                          <span className={cx('commentAuthor')}>Nguyễn Việt Đức</span>
                                                      </Link>
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
        </div>
    );
}

export default Comment;
