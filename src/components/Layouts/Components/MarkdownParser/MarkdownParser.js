import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MarkdownParser.module.scss';

const cx = classNames.bind(styles);

function MarkdownParser() {
    return (
        <div className={cx('wrapper')}>
            <p>
                Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác
                thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.{' '}
            </p>
        </div>
    );
}

export default MarkdownParser;
