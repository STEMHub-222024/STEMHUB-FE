import { useEffect, useState, useMemo, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye, IconLoader2 } from '@tabler/icons-react';
import { message } from 'antd';
import { toast } from 'react-toastify';
import Button from '~/components/Common/Button';
import SignInButton from '~/components/Common/SignInButton';
import FormControl from '~/components/Common/FormControl';
import styles from './Login.module.scss';
import config from '~/config';
import Header from './Header';
import Footer from './Footer';
import Validator, { isRequired, minLength, isValidPassword } from '~/utils/validation';
import { createSelector } from '@reduxjs/toolkit';

// Service
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAsync } from '~/app/slices/authSlice';

const cx = classNames.bind(styles);

const selectAuthData = createSelector(
    (state) => state.auth.data,
    (authData) => ({
        userName: authData.userName,
        password: authData.password,
        loading: authData.loading,
    }),
);

function Login() {
    const dispatch = useDispatch();

    const { userName, password, loading } = useSelector(selectAuthData);
    const [currentLogin, setCurrentLogin] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const IconPassword = useMemo(() => (isShowPassword ? IconEye : IconEyeClosed), [isShowPassword]);
    const inputType = useMemo(() => (isShowPassword ? 'text' : 'password'), [isShowPassword]);

    const handleShowForm = useCallback(() => setCurrentLogin(false), []);

    const togglePasswordVisibility = useCallback(() => setIsShowPassword((prev) => !prev), []);

    const handleSubmit = useCallback(
        async (data) => {
            const hide = message.loading('Đang đăng nhập...', 0);
            try {
                const result = await dispatch(loginUserAsync(data)).unwrap();
                if (result.isSuccess) {
                    const { refreshToken, accessToken } = result.response;
                    const expiresAccessToken = new Date(accessToken.expiryTokenDate);
                    const expiresRefreshToken = new Date(refreshToken.expiryTokenDate);

                    Cookies.set('accessToken', accessToken.token, { expires: expiresAccessToken });
                    Cookies.set('refreshToken', refreshToken.token, { expires: expiresRefreshToken });
                    Cookies.set('saveRefreshToken', JSON.stringify(result.response), { expires: 7 });

                    hide();
                    window.location.href = config.routes.home;
                }
            } catch (error) {
                toast.error(error.message || 'Đăng nhập thất bại!');
            } finally {
                hide();
            }
        },
        [dispatch],
    );
    useEffect(() => {
        if (!currentLogin) {
            Validator({
                form: '#form-2',
                formGroupSelector: '.form-group',
                errorSelector: '.form-message',
                rules: [
                    isRequired('#username'),
                    minLength('#password', 8),
                    isValidPassword('#password'),
                    isRequired('input[name="gender"]'),
                ],
                onSubmit: handleSubmit,
            });

            return () => {};
        }
    }, [currentLogin, handleSubmit]);

    return (
        <div className={cx('wrapper', 'hasBg')}>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <Header />
                    <div className={cx('body')}>
                        {currentLogin ? (
                            <div className={cx('mainStep')} onClick={handleShowForm}>
                                <SignInButton />
                            </div>
                        ) : (
                            <form className={cx('formBody', 'form')} id="form-2">
                                <FormControl
                                    id="username"
                                    labelTitle="Tên đăng nhập"
                                    placeholder="Tên đăng nhập"
                                    name="username"
                                    type="text"
                                    setCurrentLogin={setCurrentLogin}
                                />
                                <div className={cx('inputPassword')}>
                                    <FormControl
                                        id="password"
                                        labelStyle
                                        placeholder="Mật khẩu"
                                        name="password"
                                        type={inputType}
                                    />
                                    <IconPassword className={cx('icon')} size={20} onClick={togglePasswordVisibility} />
                                </div>
                                <Button
                                    className={cx('btnSubmit', { disabled: !userName || !password || loading })}
                                    disabled={!userName || !password || loading}
                                >
                                    {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                    &nbsp;Đăng nhập
                                </Button>
                            </form>
                        )}
                        <div className={cx('NoAcc')}>
                            <p>Bạn chưa có tài khoản?</p>
                            <Button text to={config.routes.register}>
                                Đăng ký
                            </Button>
                        </div>
                        {!currentLogin && (
                            <Link to={config.routes.forgotPassword} className={cx('forgotPassword')}>
                                Quên mật khẩu?
                            </Link>
                        )}
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Login;
