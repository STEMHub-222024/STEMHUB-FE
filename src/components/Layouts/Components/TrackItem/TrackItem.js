import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { IconCircleCheckFilled, IconCircleCaretRight } from '@tabler/icons-react';

import styles from './TrackItem.module.scss';

const cx = classNames.bind(styles);

function TrackItem({ data, index, topicParameter }) {
    const { lessonId, lessonName } = data;
    return (
        <>
            <div className={cx('wrapper')}>
                <Link className={cx('info')} to={`/${topicParameter}/${lessonName}=${lessonId}`}>
                    <h3 className={cx('title')}>
                        {`${index + 1}. `}
                        {lessonName}
                    </h3>
                    <p>
                        <IconCircleCaretRight size={18} color="rgba(240,81,35,.8)" />
                    </p>
                </Link>
                <div className={cx('icon-box')}>
                    <IconCircleCheckFilled size={20} color="#5db85c" />
                </div>
            </div>
        </>
    );
}

TrackItem.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    topicParameter: PropTypes.string,
};

export default TrackItem;
