import 'tippy.js/dist/tippy.css';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import config from '~/config';
import styles from './HeaderPost.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import { MenuPopper } from '~/components/Common/Popper/MenuPopper';
import {
    IconChevronLeft,
    IconBellFilled,
    IconUser,
    IconReport,
    IconArrowBarRight,
    IconPencil,
} from '@tabler/icons-react';
import Modal from '~/components/Common/Modal';
import { selectAuth, selectPosts } from '~/app/selectors';
import { postPostsAsync } from '~/app/slices/postSlice';
import { getUserIdAsync } from '~/app/slices/userSlice';

//Auth
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { deleteImage, postImage } from '~/services/uploadImage';

const cx = classNames.bind(styles);

function HeaderPost() {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const { title, markdown, htmlContent } = useSelector(selectPosts).data;
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetToken, setResetToken] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    useLayoutEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch, resetToken]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!infoUserCurrent.userId) {
                setResetToken(!resetToken);
            } else {
                try {
                    const res = await dispatch(getUserIdAsync({ userId: infoUserCurrent.userId })).unwrap();
                    if (res) setUserInfo(res);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };
        fetchUser();
    }, [dispatch, infoUserCurrent, resetToken]);

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('saveRefreshToken');
        dispatch(setAllow(false));
    };

    const userMenu = [
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
    ];

    const handlePost = async () => {
        if (!infoUserCurrent.userId) {
            setResetToken(!resetToken);
        } else {
            try {
                const newData = {
                    title,
                    markdown,
                    htmlContent,
                    userId: infoUserCurrent.userId,
                };
                const res = await dispatch(postPostsAsync(newData)).unwrap();
                if (res) {
                    // Chuyen huong
                    console.log('1');
                    // setIsModalOpen(!isModalOpen);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }
    };

    const handleModal = () => {
        setBackgroundImage('');
        setIsModalOpen(!isModalOpen);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = async (event) => {
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
    };
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
                                className={title && markdown ? cx('btnSubmit') : cx('btnDisabled')}
                                disabled={title && markdown ? false : true}
                                onClick={handleModal}
                            >
                                Xuất bản
                            </Button>
                            <Tippy content="Hihi">
                                <button className={cx('action-btn')}>
                                    <IconBellFilled size={25} color="#707070" stroke={2} />
                                </button>
                            </Tippy>

                            <MenuPopper items={userMenu} infoUserCurrent={infoUserCurrent}>
                                <Image
                                    className={cx('user-avatar')}
                                    src={userInfo.image ?? images.avatar_1}
                                    alt={userInfo.firstName ?? 'Avatar'}
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
                            ) : (
                                ''
                            )}
                        </div>
                        <div contentEditable={false} className={cx('title-review')}>
                            {title}
                        </div>
                        <p>
                            <strong>Lưu ý: </strong>
                            Chỉnh sửa tại đây sẽ thay đổi cách bài viết được hiển thị tại trang chủ, tin nổi bật - Chứ
                            không ảnh hưởng tới nội dung bài viết của bạn.
                        </p>
                        <div className={cx('btn-destroy-posts')}>
                            <Button mainColor medium onClick={handlePost}>
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
