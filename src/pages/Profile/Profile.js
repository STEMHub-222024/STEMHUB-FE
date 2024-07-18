import React, { useState, useLayoutEffect, useEffect, useMemo, useCallback } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Profile.module.scss';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import { selectAuth } from '~/app/selectors';
import { getUserIdAsync, putUserIdAsync } from '~/app/slices/userSlice';
import Validator, { isRequired, isEmail } from '~/utils/validation';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image as ImageNew, Upload, message, Spin } from 'antd';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import getBase64 from '~/utils/getBase64';
import { postImage, deleteImage } from '~/services/uploadImage';

const cx = classNames.bind(styles);

function Profile() {
    const dispatch = useDispatch();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const [userInfo, setUserInfo] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [imageWaitRemove, setImageWaitRemove] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const fileList = useMemo(() => {
        if (userInfo.image) {
            return [
                {
                    uid: '-1',
                    name: 'Avatar',
                    status: 'done',
                    url: userInfo.image,
                },
            ];
        }
        return [];
    }, [userInfo.image]);

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
                } finally {
                    setIsImageLoading(false);
                }
            }
        };
        fetchUser();
    }, [dispatch, infoUserCurrent, resetToken]);

    useEffect(() => {
        setFirstName(userInfo.firstName || '');
        setLastName(userInfo.lastName || '');
        setPhone(userInfo.phoneNumber || '');
        setEmail(userInfo.email || '');
    }, [userInfo]);

    const handleChange = useCallback((setter) => (e) => setter(e.target.value), []);

    const handleSubmit = useCallback(
        async (data) => {
            if (!infoUserCurrent.userId) {
                setResetToken(!resetToken);
            } else {
                setIsLoading(true);
                const hide = message.loading('Saving changes...', 0);
                try {
                    if (imageWaitRemove) {
                        await deleteImage(imageWaitRemove.split('uploadimage/')[1]);
                    }
                    const { lastName, firstName, email, phone } = data;
                    const newData = {
                        lastName,
                        firstName,
                        email,
                        phoneNumber: phone,
                        image: fileList[0]?.url ?? '',
                        userId: infoUserCurrent.userId,
                    };
                    const res = await dispatch(putUserIdAsync(newData)).unwrap();
                    if (res) {
                        message.success(res.message);
                    }
                } catch (error) {
                    console.error('Failed to update user:', error);
                    message.error('Failed to save changes');
                } finally {
                    hide();
                    setIsLoading(false);
                }
            }
        },
        [infoUserCurrent.userId, resetToken, imageWaitRemove, fileList, dispatch],
    );

    useEffect(() => {
        Validator({
            form: '#form-1',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            rules: [
                isRequired('#lastName'),
                isRequired('#firstName'),
                isRequired('#phone'),
                isRequired('#email'),
                isEmail('#email'),
                isRequired('input[name="gender"]'),
            ],
            onSubmit: handleSubmit,
        });
    }, [handleSubmit]);

    const handlePreview = useCallback(async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    }, []);

    const handleFileChange = useCallback(async ({ fileList: newFileList }) => {
        setIsImageLoading(true);
        if (newFileList.length > 0 && newFileList[0].status !== 'uploading') {
            try {
                const response = await postImage(newFileList[0].originFileObj);
                if (response) {
                    setUserInfo((prev) => ({
                        ...prev,
                        image: response.fileUrl,
                    }));
                } else {
                    message.error('Image upload failed!');
                }
            } catch (error) {
                console.error('Failed to upload image:', error);
                message.error('Image upload failed!');
            } finally {
                setIsImageLoading(false);
            }
        } else {
            setIsImageLoading(false);
        }
    }, []);

    const handleFileRemove = useCallback(async (file) => {
        if (!file.url || file.url === undefined) return;
        setImageWaitRemove(file.url);
        setUserInfo((prev) => ({ ...prev, image: '' }));
    }, []);

    const uploadButton = useMemo(
        () => (
            <button style={{ border: 0, background: 'none' }} type="button">
                {isImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Image</div>
            </button>
        ),
        [isImageLoading],
    );

    return (
        <div className={cx('wrapper')}>
            <Heading className={cx('heading')} h2>
                My Account
            </Heading>
            <form className={cx('formBody', { form: true })} id="form-1">
                <div id="file" className={cx('group-avatar')}>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleFileChange}
                        maxCount={1}
                        beforeUpload={() => false}
                        onRemove={handleFileRemove}
                        id="file"
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                        <ImageNew
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </div>

                <div className={cx('info')}>
                    <div className={cx('group-input', 'form-group')}>
                        <span className={cx('title')}>First Name</span>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={handleChange(setFirstName)}
                        />
                        <span className={cx('error-message', 'form-message')}></span>
                    </div>
                    <div className={cx('group-input', 'form-group')}>
                        <span className={cx('title')}>Last Name</span>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={handleChange(setLastName)}
                        />
                        <span className={cx('error-message', 'form-message')}></span>
                    </div>
                    <div className={cx('group-input')}>
                        <span className={cx('title')}>User Name</span>
                        <input type="text" name="userName" value={infoUserCurrent?.username} disabled />
                    </div>
                    <div className={cx('group-input', 'form-group')}>
                        <span className={cx('title')}>Phone</span>
                        <input type="text" id="phone" name="phone" value={phone} onChange={handleChange(setPhone)} />
                        <span className={cx('error-message', 'form-message')}></span>
                    </div>
                    <div className={cx('group-input', 'form-group')}>
                        <span className={cx('title')}>Email</span>
                        <input type="text" id="email" name="email" value={email} onChange={handleChange(setEmail)} />
                        <span className={cx('error-message', 'form-message')}></span>
                    </div>
                </div>

                <Button type="submit" className={cx('btn-save')} mainColor medium borderMedium disabled={isLoading}>
                    {isLoading ? <Spin /> : 'Save'}
                </Button>
            </form>
        </div>
    );
}

export default Profile;
