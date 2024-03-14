import { forwardRef } from 'react';
import classNames from 'classnames/bind';

import styles from './FormControl.module.scss';
import FormInput from './FormInput';

const cx = classNames.bind(styles);

function FormControl({ ...props }, ref) {
    const { id, labelStyle, placeholder, name, type, value, setCurrentLogin, labelTitle, labelComeback } = props;

    return (
        <div className={cx('wrapper')}>
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
            />
        </div>
    );
}

export default forwardRef(FormControl);
