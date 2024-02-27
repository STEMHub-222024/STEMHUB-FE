import { useState } from 'react';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye } from '@tabler/icons-react';

import styles from './Register.module.scss';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import images from '~/assets/images';
import SignInButton from '~/components/Common/SignInButton';
import FormControl from '~/components/Common/FormControl';
import config from '~/config';

const cx = classNames.bind(styles);

function Register() {
    const [currentLogin, setCurrentLogin] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

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
            <div className={cx('container', { 'height-container': currentLogin })}>
                <div className={cx('content', { 'height-content': currentLogin })}>
                    <div className={cx('header')}>
                        <Button className={cx('logo-link')} href="http://localhost:3003/">
                            <Image className={cx('logo')} src={images.logo} alt="web khóa học" />
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
                                <div className={cx('formBody')}>
                                    <FormControl
                                        value={name}
                                        labelTitle="Tên của bản"
                                        placeholder="Họ và tên của bạn"
                                        name="yourName"
                                        type="text"
                                        labelComeback
                                    />

                                    <FormControl
                                        value={userName}
                                        labelComeback
                                        labelTitle="Tên đăng nhâp"
                                        placeholder="Tên đăng nhập"
                                        name="userName_register"
                                        type="text"
                                    />

                                    <FormControl
                                        value={email}
                                        labelTitle="Email"
                                        placeholder="Địa chỉ email"
                                        name="email"
                                        type="text"
                                        setCurrentLogin={setCurrentLogin}
                                    />
                                    <div className={cx('inputPassword')}>
                                        <FormControl
                                            value={password}
                                            labelStyle
                                            placeholder="Mật khẩu"
                                            name="password_R"
                                            type={inputType}
                                        />

                                        <IconPassword
                                            className={cx('icon')}
                                            size={20}
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        />
                                    </div>

                                    <Button
                                        className={
                                            name && userName && email && password ? cx('btnSubmit') : cx('btnDisabled')
                                        }
                                        disabled={name && userName && email && password ? false : true}
                                    >
                                        Đăng ký
                                    </Button>
                                </div>
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
