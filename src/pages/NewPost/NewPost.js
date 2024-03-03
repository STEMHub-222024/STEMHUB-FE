import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './NewPost.module.scss';
import ContentEditable from '~/components/Common/ContentEditable';
import TextEditor from '~/components/Common/TextEditor';

const cx = classNames.bind(styles);

function NewPost() {
    return (
        <div className={cx('wrapper')}>
            <ContentEditable className={cx('title-input')} />
            <div className={cx('text-editor')}>
                <TextEditor className={cx('text-content')} html placeholder='Nội dung viết ở đây' />
            </div>
        </div>
    );
}

export default NewPost;
