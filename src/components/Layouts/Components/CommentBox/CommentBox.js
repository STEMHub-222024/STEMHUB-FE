import classNames from 'classnames/bind';
import styles from './CommentBox.module.scss';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function CommentBox() {
    return (
        <div className={cx('commentWrapper')}>
            <div className={cx('avatarWrapper')}>
                <FallbackAvatar className={cx('avatar')} linkImage={images.avatar_1} altImage="nguyen van a" />
            </div>
            <div className={cx('commentContent')}>
                <div className={cx('placeholder')}>
                    <span className={cx('comment-suggestions')}>Bạn có thắc mắc gì trong bài học này?</span>
                </div>
            </div>
        </div>
    );
}

export default CommentBox;
