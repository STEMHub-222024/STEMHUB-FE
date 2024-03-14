import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye } from '@tabler/icons-react';

import styles from './Register.module.scss';
import config from '~/config';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import images from '~/assets/images';
import SignInButton from '~/components/Common/SignInButton';
import FormControl from '~/components/Common/FormControl';
//Services
import { useDispatch, useSelector } from 'react-redux';
import { registerUserAsync } from '~/app/slices/registerSlice';
import { selectRegister } from '~/app/selectors';
import Validator, { isRequired, isEmail, minLength, isValidPassword } from '~/utils/validation';

// const Validator = require('~/utils/validation');
const cx = classNames.bind(styles);

function Register() {
    const inputNameRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userName, password } = useSelector(selectRegister).data;
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
                form: '#form-1',
                formGroupSelector: '.form-group',
                errorSelector: '.form-message',
                rules: [
                    isRequired('#lastName'),
                    isRequired('#firstName'),
                    isRequired('#username'),
                    isRequired('#email'),
                    isEmail('#email'),
                    minLength('#password', 8),
                    isValidPassword('#password'),
                    isRequired('input[name="gender"]'),
                ],
                onSubmit(data) {
                    const fetchApi = async () => {
                        try {
                            const result = await dispatch(registerUserAsync(data)).unwrap();
                            if (result) {
                                navigate('/login');
                                console.log('Đăng ký thành công...!');
                            }
                        } catch (rejectedValueOrSerializedError) {
                            inputNameRef.current.focus();
                            console.error('Đăng ký thất bại...!');
                            console.error('error register', rejectedValueOrSerializedError);
                        }
                    };
                    fetchApi();
                },
            });
        }
    }, [currentLogin]);

    const handleShowForm = () => {
        setCurrentLogin(false);
    };

    return (
        <div className={cx('wrapper', 'hasBg')}>
            <div className={cx('container', { 'height-container': currentLogin })}>
                <div className={cx('content', { 'height-content': currentLogin })}>
                    <div className={cx('header')}>
                        <Button className={cx('logo-link')} href={config.routes.home}>
                            <Image className={cx('logo')} src={images.logo} alt="Stem logo" />
                        </Button>

                        <h1 className={cx('title')}>Đăng ký tài khoản</h1>
                    </div>
                    <div className={cx('body')}>
                        {currentLogin ? (
                            <div className={cx('mainStep')} onClick={() => handleShowForm()}>
                                <SignInButton />
                            </div>
                        ) : (
                            <>
                                <form
                                    className={cx('formBody', {
                                        form: true,
                                    })}
                                    id="form-1"
                                >
                                    <div className={cx('form-name')}>
                                        <FormControl
                                            id="lastName"
                                            labelTitle="Họ & Tên đệm"
                                            placeholder="Họ & Tên đệm"
                                            name="lastName"
                                            type="text"
                                            labelComeback
                                        />
                                        <FormControl
                                            id="firstName"
                                            labelTitle="Tên của bạn"
                                            placeholder="Tên của bạn"
                                            name="firstName"
                                            type="text"
                                            labelComeback
                                        />
                                    </div>
                                    <FormControl
                                        id="username"
                                        ref={inputNameRef}
                                        labelComeback
                                        labelTitle="Tên đăng nhâp"
                                        placeholder="Tên đăng nhập"
                                        name="username"
                                        type="text"
                                    />

                                    <FormControl
                                        id="email"
                                        labelTitle="Email"
                                        placeholder="Địa chỉ email"
                                        name="email"
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

                                        <IconPassword
                                            className={cx('icon')}
                                            size={20}
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        />
                                    </div>

                                    <Button
                                        className={userName && password ? cx('btnSubmit') : cx('btnDisabled')}
                                        disabled={userName && password ? false : true}
                                    >
                                        Đăng ký
                                    </Button>
                                </form>
                            </>
                        )}
                        <div className={cx('NoAcc')}>
                            <p> Bạn chưa có tài khoản?</p>
                            <Button text to={config.routes.login}>
                                Đăng nhập
                            </Button>
                        </div>
                        {currentLogin ? (
                            <div className={cx('displayNone')}></div>
                        ) : (
                            <p className={cx('forgotPassword')}>Quên mật khẩu?</p>
                        )}
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

export default Register;
