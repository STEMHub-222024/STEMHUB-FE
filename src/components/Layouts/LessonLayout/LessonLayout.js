import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Header from '~/components/Layouts/Components/Header';
import styles from './LessonLayout.module.scss';
import Tracks from '~/components/Layouts/Components/Tracks';
import FooterLesson from '~/components/Layouts/Components/FooterLesson';
import { handleSplitParam } from '~/utils/splitParamUrl';

// Services
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLessonAsync, handleFilter } from '~/app/slices/lessonSlice';
import { selectLesson } from '~/app/selectors';
import OptionPublic from '~/components/Common/OptionPublic';

const cx = classNames.bind(styles);

function LessonLayout({ children }) {
    const { topic } = useParams();
    const dispatch = useDispatch();
    const { lessonFilter } = useSelector(selectLesson).data;

    const fetchApi = useCallback(
        async (topic) => {
            try {
                const result = handleSplitParam(topic);
                if (result) {
                    const lessonAll = await dispatch(getLessonAsync()).unwrap();
                    const lessonCurrents = lessonAll?.filter((lesson) => lesson?.topicId === result);
                    if (lessonCurrents) {
                        dispatch(handleFilter({ lessonCurrents }));
                    }
                }
            } catch (rejectedValueOrSerializedError) {}
        },
        [dispatch],
    );

    useEffect(() => {
        fetchApi(topic);

        return () => {};
    }, [fetchApi, topic]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
                <div className={cx('tracks')}>
                    <Tracks data={lessonFilter} topicParameter={topic} />
                </div>
            </div>
            <OptionPublic />
            <FooterLesson data={lessonFilter} topicParameter={topic} />
        </div>
    );
}

LessonLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LessonLayout;
