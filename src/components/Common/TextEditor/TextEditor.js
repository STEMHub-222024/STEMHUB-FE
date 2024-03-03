import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

import styles from './TextEditor.module.scss';

const cx = classNames.bind(styles);

const mdParser = new MarkdownIt(/* Markdown-it options */);

function TextEditor({ height, html = false }) {
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('text-editor')}>
                <MdEditor
                    placeholder="Bạn có thắc mắc gì trong bài học này?"
                    id="54128"
                    onImageUpload={onImageUpload}
                    view={{ menu: true, md: true, html: html }}
                    style={{ height: height }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
}

TextEditor.propTypes = {
    height: PropTypes.string.isRequired,
};

export default TextEditor;
