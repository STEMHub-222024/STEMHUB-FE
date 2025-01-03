import React, { useRef, useCallback, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
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
import { message } from 'antd';
import { postImage, deleteImage } from '~/services/uploadImage';
import styles from '~/components/Common/TextEditor/TextEditor.module.scss';

const cx = classNames.bind(styles);

const TextEditorPart = forwardRef(
    ({ placeholder, height = '500px', showHtml = false, className = '', initialContent, setMarkdown, setHtmlContent, setContent_C }, ref) => {
        const urlRef = useRef(null);
        const mdEditorRef = useRef(null);
        const uploadedImagesRef = useRef([]);
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
                        } catch (__) { }
                    }
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
            if (initialContent && mdEditorRef.current) {
                mdEditorRef.current.setText(initialContent.markdown);
            }

            const style = document.createElement('style');
            style.innerHTML = `
                    .rc-md-navigation {
                        top: 0 !important;
                    }
                `;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(style);
            };
        }, [initialContent]);

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
                } catch (error) { }
            });

            currentImages.current = Array.from(newImages);
        }, []);

        const handleEditorChange = useCallback(
            ({ html, text }) => {
                if (showHtml) {
                    setMarkdown(text);
                    setHtmlContent(html);
                } else {
                    setContent_C(html);
                }

                debounce(updateCurrentImages, 1000)(html);
            },
            [showHtml, updateCurrentImages, setMarkdown, setHtmlContent, setContent_C],
        );

        const onImageUpload = useCallback(async (file) => {
            try {
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    message.error('Kích thước file không được vượt quá 5MB!');
                    return '';
                }

                let imageFile = file;
                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    const img = new Image();
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    return new Promise((resolve) => {
                        img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob(async (blob) => {
                                imageFile = new File([blob], file.name.replace(/\.(jpg|jpeg)$/i, '.png'), {
                                    type: 'image/png',
                                });

                                try {
                                    urlRef.current = await postImage(imageFile);
                                    if (urlRef.current) {
                                        uploadedImages.current.push(urlRef.current.fileUrl);
                                        uploadingImages.current.push(urlRef.current.fileUrl);
                                        uploadedImagesRef.current.push(urlRef.current.fileUrl);
                                        resolve(urlRef.current.fileUrl);
                                    } else {
                                        message.error('Tải hình ảnh lên không thành công!');
                                        resolve('');
                                    }
                                } catch (error) {
                                    resolve('');
                                }
                            }, 'image/png');
                        };
                        img.src = URL.createObjectURL(file);
                    });
                } else if (file.type === 'image/png') {
                    urlRef.current = await postImage(file);
                    if (urlRef.current) {
                        uploadedImages.current.push(urlRef.current.fileUrl);
                        uploadingImages.current.push(urlRef.current.fileUrl);
                        uploadedImagesRef.current.push(urlRef.current.fileUrl);
                        return urlRef.current.fileUrl;
                    } else {
                        message.error('Tải hình ảnh lên không thành công!');
                    }
                } else {
                    message.error('Chỉ chấp nhận file PNG, JPG hoặc JPEG!');
                    return '';
                }
            } catch (error) {
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
                    <div
                        className={cx('wrapperEdit')}
                        dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}
                    ></div>
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
                mdEditorRef.current.setText('');
                setMarkdown('');
                setHtmlContent('');

                const imageMarkdown = uploadedImagesRef.current.map((url) => `![](${url})`).join('\n');
                mdEditorRef.current.insertText(imageMarkdown);
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
    },
);

TextEditorPart.propTypes = {
    placeholder: PropTypes.string.isRequired,
    height: PropTypes.string,
    showHtml: PropTypes.bool,
    className: PropTypes.string,
    setMarkdown: PropTypes.func.isRequired,
    setHtmlContent: PropTypes.func.isRequired,
};

export default TextEditorPart;
