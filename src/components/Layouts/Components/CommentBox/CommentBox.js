import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';
import TextEditor from '~/components/Common/TextEditor';
import Button from '~/components/Common/Button';

const cx = classNames.bind(styles);

function CommentBox() {
    const [showEditText, setShowEditText] = useState(false);

    const handleShowEditText = () => {
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
                        <TextEditor height="280px" />
                        <div className={cx('actionWrapper')}>
                            <Button text small className={cx('cancel')} onClick={handleShowEditText}>
                                Huỷ
                            </Button>
                            <Button small className={cx('ok')}>
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

export default CommentBox;
