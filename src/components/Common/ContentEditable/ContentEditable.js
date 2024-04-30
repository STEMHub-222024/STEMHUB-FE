import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ContentEditable.module.scss';
import { useDispatch } from 'react-redux';
import { setTitle } from '~/app/slices/postSlice';

const cx = classNames.bind(styles);

function ContentEditable({ className }) {
    const dispatch = useDispatch();

    const handleInput = (event) => {
        dispatch(setTitle(event.target.textContent));
    };

    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div
            className={classes}
            spellCheck="false"
            data-empty-text="Tiêu đề"
            contentEditable="true"
            onInput={handleInput}
        ></div>
    );
}

ContentEditable.propTypes = {
    className: PropTypes.string,
};

export default ContentEditable;
