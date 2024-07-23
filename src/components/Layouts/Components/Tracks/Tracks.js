import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import styles from './Tracks.module.scss';
import TrackItem from '~/components/Layouts/Components/TrackItem';
import { handleSplitParam } from '~/utils/splitParamUrl';

const cx = classNames.bind(styles);

function Tracks({ data, topicParameter, onClose }) {
    const { lessonId: currentLessonId } = useParams();

    const currentLessonIdNew = handleSplitParam(currentLessonId);

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
                                  isActive={lessonItem.lessonId === currentLessonIdNew}
                                  onClose={onClose}
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
