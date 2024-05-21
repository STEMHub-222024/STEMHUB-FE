import { useState, useLayoutEffect, memo } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';
import TextEditor from '~/components/Common/TextEditor';
import Button from '~/components/Common/Button';
import { commentPostAsync } from '~/app/slices/commentSlice';
import { selectComment, selectAuth } from '~/app/selectors';
import { handleSplitParam } from '~/utils/splitParamUrl';

// Check Auth
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';

const cx = classNames.bind(styles);

function CommentBox({ commentByLessonIds }) {
    const dispatch = useDispatch();
    const { lessonId } = useParams();
    const { content_C } = useSelector(selectComment).data;
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const [showEditText, setShowEditText] = useState(false);
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

    const handleShowEditText = () => {
        setShowEditText(!showEditText);
    };

    const handleComment = async () => {
        if (!infoUserCurrent.userId) {
            setIsResetToken(!resetToken);
        } else {
            const lessonIdSplit = handleSplitParam(lessonId);
            if (!lessonIdSplit) {
                message.warning('LessonId does not exist');
            }
            await dispatch(
                commentPostAsync({
                    content_C,
                    lessonId: lessonIdSplit,
                    userId: infoUserCurrent.userId,
                }),
            );
        }
        setShowEditText(!showEditText);
    };
    return (
        <div className={cx('commentWrapper')}>
            <div className={cx('avatarWrapper')}>
                <FallbackAvatar className={cx('avatar')} linkImage={images.avatar_1} altImage="nguyen van a" />
            </div>
            <div className={cx('commentContent')}>
                {showEditText ? (
                    <>
                        <TextEditor height="280px" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                        <div className={cx('actionWrapper')}>
                            <Button text small className={cx('cancel')} onClick={handleShowEditText}>
                                Huỷ
                            </Button>
                            <Button
                                small
                                className={
                                    content_C
                                        ? cx('btnSubmit')
                                        : cx('btnDisabled', {
                                              ok: true,
                                          })
                                }
                                disabled={content_C ? false : true}
                                onClick={handleComment}
                            >
                                Bình luận
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className={cx('placeholder')}>
                        <span className={cx('comment-suggestions')} onClick={handleShowEditText}>
                            Bạn có thắc mắc gì trong bài học này?
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(CommentBox);
