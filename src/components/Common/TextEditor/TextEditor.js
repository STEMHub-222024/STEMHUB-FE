import React, { useRef, useCallback, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
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

const TextEditor = forwardRef(({ placeholder, height = '500px', showHtml = false, className = '' }, ref) => {
    const dispatch = useDispatch();
    const urlRef = useRef(null);
    const mdEditorRef = useRef(null);
    const uploadedImages = useRef([]);
    const currentImages = useRef([]);
    const uploadingImages = useRef([]);
    const debounceTimeout = useRef(null);

    const mdParser = useMemo(() => {
        const parser = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (__) {}
                }
                return '';
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

        return parser;
    }, []);

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => func(...args), delay);
        };
    };

    const updateCurrentImages = useCallback((html) => {
        const newImages = new Set(Array.from(html.matchAll(/<img src="(.*?)"/g)).map((match) => match[1]));
        const uploadingSet = new Set(uploadingImages.current);

        const deletedImages = currentImages.current.filter((url) => !newImages.has(url) && !uploadingSet.has(url));

        deletedImages.forEach(async (url) => {
            try {
                await deleteImage(url.split('uploadimage/')[1]);
                uploadedImages.current = uploadedImages.current.filter((imgUrl) => imgUrl !== url);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        });

        currentImages.current = Array.from(newImages);
    }, []);

    const handleEditorChange = useCallback(
        ({ html, text }) => {
            if (showHtml) {
                dispatch(setMarkdown(text));
                dispatch(setHtmlContent(html));
            } else {
                dispatch(setContent_C(html));
            }

            debounce(updateCurrentImages, 1000)(html);
        },
        [dispatch, showHtml, updateCurrentImages],
    );

    const onImageUpload = useCallback(async (file) => {
        try {
            urlRef.current = await postImage(file);
            if (urlRef.current) {
                uploadedImages.current.push(urlRef.current.fileUrl);
                uploadingImages.current.push(urlRef.current.fileUrl);
                return urlRef.current.fileUrl;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return '';
        } finally {
            if (urlRef.current) {
                setTimeout(() => {
                    uploadingImages.current = uploadingImages.current.filter(
                        (imgUrl) => imgUrl !== urlRef.current.fileUrl,
                    );
                }, 1000);
            }
        }
    }, []);

    const renderHTML = useCallback(
        (text) => {
            return (
                <div className={cx('wrapperEdit')} dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}></div>
            );
        },
        [mdParser],
    );

    const editorConfig = useMemo(
        () => ({
            view: {
                menu: true,
                md: true,
                html: true,
            },
            shortcuts: {
                toggleUnorderedList: 'Shift-U',
            },
        }),
        [],
    );

    const classes = cx('mdEdit', {
        [className]: className,
    });

    const clearEditorContent = () => {
        if (mdEditorRef.current) {
            mdEditorRef.current.setState({
                text: '',
                html: '',
            });
            dispatch(setMarkdown(''));
            dispatch(setHtmlContent(''));
        }
    };

    useImperativeHandle(ref, () => ({
        clearEditorContent,
    }));

    return (
        <div className={cx('wrapper')}>
            <div className={cx('text-editor')}>
                <MdEditor
                    ref={mdEditorRef}
                    placeholder={placeholder}
                    onImageUpload={onImageUpload}
                    view={{ menu: true, md: true, html: showHtml }}
                    style={{ height: height }}
                    className={classes}
                    renderHTML={renderHTML}
                    onChange={handleEditorChange}
                    config={editorConfig}
                />
            </div>
        </div>
    );
});

TextEditor.propTypes = {
    placeholder: PropTypes.string.isRequired,
    height: PropTypes.string,
    showHtml: PropTypes.bool,
    className: PropTypes.string,
};

export default TextEditor;
