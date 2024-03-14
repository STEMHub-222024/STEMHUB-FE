import { forwardRef } from 'react';
import classNames from 'classnames/bind';

import { useDispatch } from 'react-redux';
import { setUserName, setPassword } from '~/app/slices/registerSlice';

import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

function FormInput({ medium, ...props }, ref) {
    const dispatch = useDispatch();

    const { id, labelStyle, placeholder, value, name, type, setCurrentLogin, labelTitle, labelComeback } = props;

    const handleInputValue = (e) => {
        switch (name) {
            case 'username':
                dispatch(setUserName(e.target.value));
                break;
            case 'password':
                dispatch(setPassword(e.target.value));
                break;
            default:
                return;
        }
    };
    return (
        <div
            className={cx('wrapper', {
                'form-group': true,
            })}
        >
            <div
                className={cx('labelGroup', {
                    labelStyle,
                })}
            >
                <label className={cx('label')}>{labelTitle}</label>
                <label
                    className={cx('label', {
                        right: true,
                        labelComeback,
                    })}
                    onClick={() => {
                        setCurrentLogin(true);
                    }}
                >
                    Quay lại
                </label>
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
                    maxLength={40}
                />
            </div>
            <span
                className={cx('error-message', {
                    'form-message': true,
                })}
            ></span>
        </div>
    );
}

export default forwardRef(FormInput);
