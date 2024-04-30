import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { setContent_C } from '~/app/slices/commentSlice';
import { setMarkdown, setHtmlContent } from '~/app/slices/postSlice';

import styles from './TextEditor.module.scss';

const cx = classNames.bind(styles);

const mdParser = new MarkdownIt(/* Markdown-it options */);

function TextEditor({ placeholder, height, showHtml = false, className }) {
    const dispatch = useDispatch();

    //have text
    function handleEditorChange({ html, text }) {
        if (showHtml) {
            dispatch(setMarkdown(text));
            dispatch(setHtmlContent(html));
        } else {
            dispatch(setContent_C(html));
        }
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
                    view={{ menu: true, md: true, html: showHtml }}
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
