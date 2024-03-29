import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

import styles from './TextEditor.module.scss';

const cx = classNames.bind(styles);

const mdParser = new MarkdownIt(/* Markdown-it options */);

function TextEditor({ placeholder, height, html = false, className }) {
    function handleEditorChange({ html, text }) {
        console.log('handleEditorChange', html, text);
    }
    function onImageUpload(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (data) => {
                resolve(data.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    const classes = cx('mdEdit', {
        [className]: className,
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('text-editor')}>
                <MdEditor
                    placeholder={placeholder}
                    onImageUpload={onImageUpload}
                    view={{ menu: true, md: true, html: html }}
                    style={{ height: height }}
                    className={classes}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
}

TextEditor.propTypes = {
    placeholder: PropTypes.string.isRequired,
    height: PropTypes.string,
    className: PropTypes.string,
};

export default TextEditor;
