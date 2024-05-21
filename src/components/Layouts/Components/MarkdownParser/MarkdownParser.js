import classNames from 'classnames/bind';
import styles from './MarkdownParser.module.scss';

const cx = classNames.bind(styles);

function MarkdownParser({ content_C }) {
    return <div className={cx('wrapper')} dangerouslySetInnerHTML={{ __html: content_C }} />;
}

export default MarkdownParser;
