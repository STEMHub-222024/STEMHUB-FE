import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { full as emoji } from 'markdown-it-emoji';
import subscript from 'markdown-it-sub';
import superscript from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import abbreviation from 'markdown-it-abbr';
import insert from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import tasklists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import { setContent_C } from '~/app/slices/commentSlice';
import { setMarkdown, setHtmlContent } from '~/app/slices/postSlice';
import styles from './TextEditor.module.scss';
import { postImage, deleteImage } from '~/services/uploadImage';

const cx = classNames.bind(styles);

const mdParser = new MarkdownIt({
    html: false, // Sử dụng HTML cho các danh sách
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }
        return ''; // use external default escaping
    },
})
    .use(emoji)
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists);

function TextEditor({ placeholder, height = '500px', showHtml = false, className = '' }) {
    const dispatch = useDispatch();
    const uploadedImages = useRef([]);
    const currentImages = useRef([]);
    const uploadingImages = useRef([]);
    const debounceTimeout = useRef(null);

    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => func(...args), delay);
        };
    };

    const updateCurrentImages = useCallback((html) => {
        const newImages = Array.from(html.matchAll(/<img src="(.*?)"/g)).map((match) => match[1]);

        const deletedImages = currentImages.current.filter(
            (url) => !newImages.includes(url) && !uploadingImages.current.includes(url),
        );

        deletedImages.forEach(async (url) => {
            try {
                await deleteImage(url.split('uploadimage/')[1]);
                uploadedImages.current = uploadedImages.current.filter((imgUrl) => imgUrl !== url);
                currentImages.current = currentImages.current.filter((imgUrl) => imgUrl !== url);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        });

        currentImages.current = newImages;
    }, []);

    const handleEditorChange = ({ html, text }) => {
        if (showHtml) {
            dispatch(setMarkdown(text));
            dispatch(setHtmlContent(html));
        } else {
            dispatch(setContent_C(html));
        }

        debounce(updateCurrentImages, 1000)(html);
    };

    const onImageUpload = async (file) => {
        let url;
        try {
            url = await postImage(file);
            if (url) {
                uploadedImages.current.push(url.fileUrl);
                uploadingImages.current.push(url.fileUrl);
                return url.fileUrl;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return '';
        } finally {
            if (url) {
                setTimeout(() => {
                    uploadingImages.current = uploadingImages.current.filter((imgUrl) => imgUrl !== url.fileUrl);
                }, 1000);
            }
        }
    };

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
                    config={{
                        view: {
                            menu: true, // Hiển thị menu
                            md: true, // Hiển thị tab Markdown
                            html: true, // Hiển thị tab HTML
                        },
                        shortcuts: {
                            toggleUnorderedList: 'Cmd-Shift-U', // Phím tắt để chuyển đổi giữa danh sách không có thứ tự
                        },
                    }}
                />
            </div>
        </div>
    );
}

TextEditor.propTypes = {
    placeholder: PropTypes.string.isRequired,
    height: PropTypes.string,
    showHtml: PropTypes.bool,
    className: PropTypes.string,
};

export default TextEditor;
