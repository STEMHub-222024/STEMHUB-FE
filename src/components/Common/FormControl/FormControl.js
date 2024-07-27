import { forwardRef, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './FormControl.module.scss';
import FormInput from './FormInput';

const cx = classNames.bind(styles);

const FormControl = (props, ref) => {
    const {
        id,
        labelStyle,
        placeholder,
        name,
        type,
        value,
        setCurrentLogin,
        labelTitle,
        labelComeback,
        showBack,
        maxLengthToken,
        hidden,
    } = props;

    return (
        <div className={cx('wrapper', { hidden })}>
            <FormInput
                ref={ref}
                id={id}
                labelStyle={labelStyle}
                labelTitle={labelTitle}
                placeholder={placeholder}
                value={value}
                name={name}
                type={type}
                setCurrentLogin={setCurrentLogin}
                labelComeback={labelComeback}
                showBack={showBack}
                maxLengthToken={maxLengthToken}
            />
        </div>
    );
};

export default memo(forwardRef(FormControl));
