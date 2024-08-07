import { forwardRef, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { setUserName, setPassword, setEmail } from '~/app/slices/authSlice';
import { setToken, setEmailUser, setPasswordUser, setConfirmPassword } from '~/app/slices/userSlice';
import classNames from 'classnames/bind';
import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

const FormInput = (props, ref) => {
    const dispatch = useDispatch();

    const {
        id,
        labelStyle,
        placeholder,
        value,
        name,
        type,
        setCurrentLogin,
        labelTitle,
        labelComeback,
        showBack,
        maxLengthToken,
    } = props;

    const handleInputValue = useCallback(
        (e) => {
            const { value } = e.target;
            switch (name) {
                case 'username':
                    dispatch(setUserName(value));
                    break;
                case 'password':
                    dispatch(setPassword(value));
                    break;
                case 'passwordUser':
                    dispatch(setPasswordUser(value));
                    break;
                case 'email':
                    dispatch(setEmail(value));
                    dispatch(setPasswordUser(value));
                    break;
                case 'emailUser':
                    dispatch(setEmailUser(value));
                    break;
                case 'token':
                    dispatch(setToken(value));
                    break;
                case 'confirmPassword':
                    dispatch(setConfirmPassword(value));
                    break;
                default:
                    return;
            }
        },
        [name, dispatch],
    );

    return (
        <div className={cx('wrapper', { 'form-group': true })}>
            <div className={cx('labelGroup', { labelStyle })}>
                <label className={cx('label')}>{labelTitle}</label>
                {!showBack && (
                    <label
                        className={cx('label', { right: true, labelComeback })}
                        onClick={() => setCurrentLogin(true)}
                    >
                        Quay lại
                    </label>
                )}
            </div>

            <div className={cx('inputWrap')}>
                <input
                    ref={ref}
                    id={id}
                    value={value}
                    onChange={handleInputValue}
                    placeholder={placeholder}
                    name={name}
                    type={type}
                    autoComplete="on"
                    maxLength={maxLengthToken ? 500 : 40}
                />
            </div>
            <span className={cx('error-message', { 'form-message': true })}></span>
        </div>
    );
};

export default memo(forwardRef(FormInput));
