import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye, IconLoader2 } from '@tabler/icons-react';

import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import FormControl from '~/components/Common/FormControl';
import images from '~/assets/images';
import styles from './ForgotPassword.module.scss';
import config from '~/config';
import Validator, { isRequired, minLength, isValidPassword, isEmail, isConfirmed } from '~/utils/validation';

//Service
import { useDispatch, useSelector } from 'react-redux';
import { optEmailAsync, resetPasswordAsync } from '~/app/slices/userSlice';
import { selectUser } from '~/app/selectors';

const cx = classNames.bind(styles);

function Login() {
    const inputNameRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, email, password, confirmPassword, loading } = useSelector(selectUser).data;
    const [currentLogin, setCurrentLogin] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);

    let IconPassword = IconEyeClosed;
    let inputType = 'password';
    if (isShowPassword) {
        IconPassword = IconEye;
        inputType = 'text';
    }

    useEffect(() => {
        if (!currentLogin) {
            Validator({
                form: '#form-2',
                formGroupSelector: '.form-group',
                errorSelector: '.form-message',
                rules: [
                    isRequired('#token'),
                    isRequired('#email'),
                    isEmail('#email'),
                    minLength('#password', 8),
                    isValidPassword('#password'),
                    isRequired('input[name="gender"]'),
                    isRequired('#confirmPassword'),
                    isConfirmed(
                        '#confirmPassword',
                        function () {
                            return document.querySelector('#form-2 #password').value;
                        },
                        'Mật khẩu nhập lại không chính xác',
                    ),
                ],
                onSubmit(data) {
                    const fetchApi = async () => {
                        try {
                            const result = await dispatch(resetPasswordAsync(data)).unwrap();
                            if (result) {
                                navigate(config.routes.login);
                                console.log('result', result);
                            }
                        } catch (rejectedValueOrSerializedError) {
                            console.error(rejectedValueOrSerializedError);
                        }
                    };
                    fetchApi();
                },
            });
        } else {
            Validator({
                form: '#form-2',
                formGroupSelector: '.form-group',
                errorSelector: '.form-message',
                rules: [isRequired('#email'), isEmail('#email'), isRequired('input[name="gender"]')],
                onSubmit(data) {
                    const fetchApi = async () => {
                        try {
                            const result = await dispatch(optEmailAsync(data)).unwrap();
                            if (result) {
                                setCurrentLogin(false);
                                console.log('result', result);
                            }
                        } catch (rejectedValueOrSerializedError) {
                            console.error(rejectedValueOrSerializedError);
                        }
                    };
                    fetchApi();
                },
            });
        }
    }, [dispatch, navigate, currentLogin]);

    return (
        <div className={cx('wrapper', 'hasBg')}>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <Button className={cx('logo-link')} to={config.routes.home}>
                            <Image className={cx('logo')} src={images.logo} alt="web khóa học" />
                        </Button>

                        <h1 className={cx('title')}>Lấy lại mật khẩu</h1>
                    </div>
                    <div className={cx('body')}>
                        {currentLogin ? (
                            <form
                                className={cx('formBody', {
                                    form: true,
                                })}
                                id="form-2"
                            >
                                <FormControl
                                    id="email"
                                    labelTitle="Email của bạn"
                                    placeholder="Địa chỉ email"
                                    name="emailUser"
                                    type="text"
                                    showBack
                                />

                                <Button
                                    className={email ? cx('btnSubmit') : cx('btnDisabled')}
                                    disabled={email ? false : true}
                                >
                                    {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                    &nbsp;Tiếp theo
                                </Button>
                            </form>
                        ) : (
                            <>
                                <form
                                    className={cx('formBody', {
                                        form: true,
                                    })}
                                    id="form-2"
                                >
                                    <FormControl
                                        id="email"
                                        labelTitle="Email"
                                        placeholder="Địa chỉ email"
                                        name="emailUser"
                                        type="text"
                                        setCurrentLogin={setCurrentLogin}
                                    />
                                    <div className={cx('inputPassword')}>
                                        <FormControl
                                            id="password"
                                            labelStyle
                                            placeholder="Mật khẩu"
                                            name="passwordUser"
                                            type={inputType}
                                        />
                                        <IconPassword
                                            className={cx('icon')}
                                            size={20}
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        />
                                    </div>

                                    <div className={cx('inputPassword')}>
                                        <FormControl
                                            id="confirmPassword"
                                            labelStyle
                                            placeholder="Xác nhận mật khẩu"
                                            name="confirmPassword"
                                            type={inputType}
                                        />
                                    </div>

                                    <FormControl
                                        id="token"
                                        ref={inputNameRef}
                                        labelComeback
                                        labelTitle="Mã OTP"
                                        placeholder="OTP"
                                        name="token"
                                        type="text"
                                        maxLengthToken
                                    />

                                    <Button
                                        className={
                                            token && email && password && confirmPassword
                                                ? cx('btnSubmit')
                                                : cx('btnDisabled')
                                        }
                                        disabled={token && email && password && confirmPassword ? false : true}
                                    >
                                        {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                        &nbsp;Xác nhận
                                    </Button>
                                </form>
                            </>
                        )}
                        <div className={cx('NoAcc')}>
                            <p>Bạn chưa có tài khoản?</p>
                            <Button text to={config.routes.register}>
                                Đăng ký
                            </Button>
                        </div>
                    </div>
                    <div className={cx('footer')}>
                        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
                        <a href="http://localhost:3003/terms">Điều khoản sử dụng</a>
                        của chúng tôi.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
