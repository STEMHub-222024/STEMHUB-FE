import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Tracks.module.scss';
import TrackItem from '~/components/Layouts/Components/TrackItem';

const cx = classNames.bind(styles);

function Tracks({ data, topicParameter }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <h2>Nội dung khóa học</h2>
                </header>
                <div className={cx('body')}>
                    {data
                        ? data?.map((lessonItem, index) => (
                              <TrackItem
                                  key={lessonItem?.lessonId}
                                  data={lessonItem}
                                  index={index}
                                  topicParameter={topicParameter}
                              />
                          ))
                        : ''}
                </div>
            </div>
        </div>
    );
}

Tracks.propTypes = {
    data: PropTypes.array,
    topicParameter: PropTypes.string,
};

export default Tracks;
