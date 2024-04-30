import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Modal({ children, isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }
    return ReactDOM.createPortal(
        <div
            className={cx('modal', {
                'fade-in': true,
            })}
        >
            <div className={cx('close')} onClick={onClose}>
                x
            </div>
            <div className={cx('content')}>{children}</div>
        </div>,
        document.body,
    );
}

export default Modal;
