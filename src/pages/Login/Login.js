import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye, IconLoader2 } from '@tabler/icons-react';

import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import SignInButton from '~/components/Common/SignInButton';
import FormControl from '~/components/Common/FormControl';
import images from '~/assets/images';
import styles from './Login.module.scss';
import config from '~/config';
import Validator, { isRequired, minLength, isValidPassword } from '~/utils/validation';

//Service
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAsync } from '~/app/slices/authSlice';
import { selectAuth } from '~/app/selectors';

const cx = classNames.bind(styles);

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userName, password, loading } = useSelector(selectAuth).data;
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
                    isRequired('#username'),
                    minLength('#password', 8),
                    isValidPassword('#password'),
                    isRequired('input[name="gender"]'),
                ],
                onSubmit(data) {
                    const fetchApi = async () => {
                        try {
                            const result = await dispatch(loginUserAsync(data)).unwrap();
                            if (result) {
                                navigate(config.routes.home);
                                console.log('Đăng nhập thành công...!');
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

    const handleShowForm = () => {
        setCurrentLogin(false);
    };

    return (
        <div className={cx('wrapper', 'hasBg')}>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <Button className={cx('logo-link')} to={config.routes.home}>
                            <Image className={cx('logo')} src={images.logo} alt="web khóa học" />
                        </Button>

                        <h1 className={cx('title')}>Đăng nhập vào Web</h1>
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
                                    id="form-2"
                                >
                                    <FormControl
                                        id="username"
                                        labelTitle="Tên đăng nhâp"
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
                                        {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                        &nbsp;Đăng nhập
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
                        {currentLogin ? (
                            <div className={cx('displayNone')}></div>
                        ) : (
                            <Link to={config.routes.forgotPassword} className={cx('forgotPassword')}>
                                Quên mật khẩu?
                            </Link>
                        )}
                    </div>
                    <div className={cx('footer')}>
                        Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với
                        <a href={config.routes.home}>Điều khoản sử dụng</a>
                        của chúng tôi.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
