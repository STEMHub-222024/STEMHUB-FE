import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconEyeClosed, IconEye, IconLoader2 } from '@tabler/icons-react';
import { message } from 'antd';
import Button from '~/components/Common/Button';
import Image from '~/components/Common/Image';
import FormControl from '~/components/Common/FormControl';
import images from '~/assets/images';
import styles from './ResetPassword.module.scss';
import config from '~/config';
import Validator, { isRequired, minLength, isValidPassword, isEmail, isConfirmed } from '~/utils/validation';
import { toast } from 'react-toastify';

//Service
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAsync } from '~/app/slices/userSlice';
import { selectUser } from '~/app/selectors';
import useQuery from '~/utils/useQuery';

const cx = classNames.bind(styles);

function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, password, confirmPassword, loading } = useSelector(selectUser).data;
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    let IconPassword = IconEyeClosed;
    let inputType = 'password';
    if (isShowPassword) {
        IconPassword = IconEye;
        inputType = 'text';
    }

    const token = useQuery().get('token');

    useEffect(() => {
        Validator({
            form: '#form-2',
            formGroupSelector: '.form-group',
            errorSelector: '.form-message',
            rules: [
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
                const hide = message.loading('Vui lòng chờ...', 0);
                const fetchApi = async () => {
                    try {
                        setIsLoading(false);
                        const result = await dispatch(
                            resetPasswordAsync({
                                ...data,
                                token,
                            }),
                        ).unwrap();
                        if (result) {
                            hide();
                            setIsLoading(true);
                            navigate(config.routes.login);
                            toast.success(result);
                        }
                    } catch (rejectedValueOrSerializedError) {
                        hide();
                        setIsLoading(true);
                        toast.error(rejectedValueOrSerializedError);
                    }
                };
                fetchApi();
            },
        });
    }, [dispatch, navigate, token]);

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
                                showBack
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

                            <Button
                                className={
                                    isLoading && email && password && confirmPassword
                                        ? cx('btnSubmit')
                                        : cx('btnDisabled')
                                }
                                disabled={isLoading && email && password && confirmPassword ? false : true}
                            >
                                {loading && <IconLoader2 className={cx('loading')} size={20} />}
                                &nbsp;Xác nhận
                            </Button>
                        </form>

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

export default ResetPassword;
