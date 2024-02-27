import { useState } from 'react';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye, IconLoader2 } from '@tabler/icons-react';

import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import SignInButton from '~/components/Common/SignInButton';
import FormControl from '~/components/Common/FormControl';
import images from '~/assets/images';
import styles from './Login.module.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function Login() {
    const [currentLogin, setCurrentLogin] = useState(true);
    const [userName_L, setUserName_L] = useState('');
    const [password_L, setPassword_L] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    let IconPassword = IconEyeClosed;

    let inputType = 'password';
    if (isShowPassword) {
        IconPassword = IconEye;
        inputType = 'text';
    }

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
                                <div className={cx('formBody')}>
                                    <FormControl
                                        labelTitle="Tên đăng nhâp"
                                        placeholder="Tên đăng nhập"
                                        name="Username_login"
                                        type="text"
                                        value={userName_L}
                                        setUserName_L={setUserName_L}
                                        setCurrentLogin={setCurrentLogin}
                                    />
                                    <div className={cx('inputPassword')}>
                                        <FormControl
                                            labelStyle
                                            placeholder="Mật khẩu"
                                            name="password_login"
                                            type={inputType}
                                            value={password_L}
                                            setPassword_L={setPassword_L}
                                        />
                                        <IconPassword
                                            className={cx('icon')}
                                            size={20}
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        />
                                    </div>

                                    <Button
                                        className={userName_L && password_L ? cx('btnSubmit') : cx('btnDisabled')}
                                        disabled={userName_L && password_L ? false : true}
                                    >
                                        {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                        &nbsp;Đăng nhập
                                    </Button>
                                </div>
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

export default Login;
