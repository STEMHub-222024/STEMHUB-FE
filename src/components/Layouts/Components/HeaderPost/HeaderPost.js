import 'tippy.js/dist/tippy.css';
import Cookies from 'js-cookie';
import classNames from 'classnames/bind';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useUserInfo from '~/hooks/useUserInfo';
import config from '~/config';
import styles from './HeaderPost.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import Modal from '~/components/Common/Modal';
import { MenuPopper } from '~/components/Common/Popper/MenuPopper';
import { IconChevronLeft, IconUser, IconReport, IconArrowBarRight, IconPencil } from '@tabler/icons-react';
import { selectAuth, selectPosts } from '~/app/selectors';
import { postPostsAsync } from '~/app/slices/postSlice';
import { setAllow } from '~/app/slices/authSlice';
import { deleteImage, postImage } from '~/services/uploadImage';

const cx = classNames.bind(styles);

function HeaderPost() {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const { title, markdown, htmlContent } = useSelector(selectPosts).data;
    const [descriptionPosts, setDescriptionPosts] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');
    const { data: userInfo } = useUserInfo(infoUserCurrent?.userId);

    const [localTitle, setLocalTitle] = useState(title);
    const [localMarkdown, setLocalMarkdown] = useState(markdown);
    const [localHtmlContent, setLocalHtmlContent] = useState(htmlContent);

    useEffect(() => {
        setLocalTitle(title);
        setLocalMarkdown(markdown);
        setLocalHtmlContent(htmlContent);
    }, [title, markdown, htmlContent]);

    const handleLogout = useCallback(() => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('saveRefreshToken');
        dispatch(setAllow(false));
        navigate(config.routes.login);
    }, [dispatch, navigate]);

    const userMenu = useMemo(
        () => [
            {
                icon: <IconUser size={15} color="#333" stroke={2} />,
                title: 'Trang cá nhân',
                to: config.routes.personal,
            },
            {
                icon: <IconPencil size={15} color="#333" stroke={2} />,
                title: 'Viết blog',
                to: config.routes.newPost,
            },
            {
                icon: <IconReport size={15} color="#333" stroke={2} />,
                title: 'Bài viết của tôi',
                to: '/',
            },
            {
                icon: <IconArrowBarRight size={15} color="#333" stroke={2} />,
                title: 'Đăng Xuất',
                logout: handleLogout,
            },
        ],
        [handleLogout],
    );

    const handleTitlePlaceholder = useCallback((e) => {
        const content = e.target.textContent.trim();
        setDescriptionPosts(content);
        if (content) {
            setDescriptionError('');
        }
    }, []);

    const validateDescription = useCallback(() => {
        if (!descriptionPosts.trim()) {
            setDescriptionError('Vui lòng nhập mô tả');
            return false;
        }
        setDescriptionError('');
        return true;
    }, [descriptionPosts]);

    const handlePost = useCallback(async () => {
        if (validateDescription()) {
            const hide = message.loading('Đang xuất bản...', 0);
            try {
                const newData = {
                    title: localTitle,
                    image: backgroundImage,
                    description: descriptionPosts,
                    markdown: localMarkdown,
                    htmlContent: localHtmlContent,
                    userId: infoUserCurrent.userId,
                };

                const res = await dispatch(postPostsAsync(newData)).unwrap();

                hide();

                if (res) {
                    message.success('Xuất bản thành công!');
                    navigate(config.routes.home);
                    setIsModalOpen(false);
                }
            } catch (error) {
                hide();
                message.error('Xuất bản thất bại!');
            }
        }
    }, [
        validateDescription,
        backgroundImage,
        descriptionPosts,
        localTitle,
        localMarkdown,
        localHtmlContent,
        infoUserCurrent,
        dispatch,
        navigate,
    ]);

    const handleModal = useCallback(() => {
        setBackgroundImage('');
        setIsModalOpen((prev) => !prev);
    }, []);

    const handleFileClick = useCallback(() => {
        fileInputRef.current.click();
    }, []);

    const handleFileChange = useCallback(
        async (event) => {
            const currentImageURL = backgroundImage;

            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];
                if (file) {
                    try {
                        const imageURL = await postImage(file);
                        setBackgroundImage(imageURL.fileUrl);
                        if (currentImageURL) {
                            await deleteImage(currentImageURL.split('uploadimage/')[1]);
                        }
                    } catch (error) {
                        message.error('Tải hình ảnh lên không thành công!');
                    }
                }
            } else {
                message.info('Không có file nào được chọn.');
            }
        },
        [backgroundImage],
    );

    return (
        <>
            <header className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('group-logo')}>
                        <Link to={config.routes.home} className={cx('small-group-logo')}>
                            <img src={images.logo} className={cx('logo')} alt="stem" />
                        </Link>
                        <Button
                            to={config.routes.home}
                            leftIcon={<IconChevronLeft className={cx('icon-back')} />}
                            className={cx('btn-back')}
                        >
                            Quay lại
                        </Button>
                    </div>

                    <div className={cx('actions')}>
                        <div className={cx('group-action')}>
                            <Button
                                mainColor
                                small
                                className={localTitle && localMarkdown ? cx('btnSubmit') : cx('btnDisabled')}
                                onClick={handleModal}
                                disabled={!localTitle || !localMarkdown}
                            >
                                Xuất bản
                            </Button>

                            <MenuPopper items={userMenu} infoUserCurrent={infoUserCurrent}>
                                <Image
                                    className={cx('user-avatar')}
                                    src={userInfo?.image ?? ''}
                                    alt={userInfo?.firstName ?? 'Avatar'}
                                />
                            </MenuPopper>
                        </div>
                    </div>
                </div>
            </header>
            <Modal isOpen={isModalOpen} onClose={handleModal}>
                <section className={cx('modal-wide')}>
                    <div className={cx('story-preview-block')}>
                        <h3>Xem trước</h3>
                        <div
                            role="button"
                            tabIndex={0}
                            className={cx('img')}
                            onClick={handleFileClick}
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                            <input
                                ref={fileInputRef}
                                accept="image/*"
                                type="file"
                                tabIndex={-1}
                                hidden
                                onChange={handleFileChange}
                            />
                            {!backgroundImage ? (
                                <>
                                    <p>
                                        Thêm một ảnh đại diện hấp dẫn sẽ giúp bài viết của bạn cuốn hút hơn với độc giả.
                                    </p>
                                    <span>Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh</span>
                                </>
                            ) : null}
                        </div>
                        <div className={cx('title-review')}>{localTitle}</div>
                        <div
                            contentEditable
                            className={cx('title-review', {
                                'title-placeholder': !descriptionPosts,
                                error: descriptionError,
                            })}
                            data-empty-text="Nhập mô tả khi tin được hiển thị"
                            onInput={handleTitlePlaceholder}
                            onBlur={validateDescription}
                        />
                        {descriptionError && <span className={cx('error-message')}>{descriptionError}</span>}
                        <p>
                            <strong>Lưu ý: </strong>
                            Chỉnh sửa tại đây sẽ thay đổi cách bài viết được hiển thị tại trang chủ, tin nổi bật - Chứ
                            không ảnh hưởng tới nội dung bài viết của bạn.
                        </p>
                        <div className={cx('btn-destroy-posts')}>
                            <Button
                                mainColor
                                medium
                                onClick={handlePost}
                                disabled={!localTitle || !localMarkdown || !backgroundImage || !descriptionPosts.trim()}
                            >
                                Xuất bản ngay
                            </Button>
                        </div>
                    </div>
                </section>
            </Modal>
        </>
    );
}

export default HeaderPost;
