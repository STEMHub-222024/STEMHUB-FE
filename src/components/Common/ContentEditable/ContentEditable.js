import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ContentEditable.module.scss';

const cx = classNames.bind(styles);

function ContentEditable({ className }) {
    const [content, setContent] = useState('');

    const handleInput = (event) => {
        const newContent = event.target.textContent;
        setContent(newContent);
    };

    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div
            className={classes}
            spellCheck="false"
            data-empty-text="Tiêu đề"
            contentEditable="true"
            onInput={handleInput}
        ></div>
    );
}

ContentEditable.propTypes = {
    className: PropTypes.string,
};

export default ContentEditable;
