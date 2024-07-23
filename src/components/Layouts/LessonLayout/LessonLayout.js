import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Header from '~/components/Layouts/Components/Header';
import styles from './LessonLayout.module.scss';
import Tracks from '~/components/Layouts/Components/Tracks';
import FooterLesson from '~/components/Layouts/Components/FooterLesson';
import { handleSplitParam } from '~/utils/splitParamUrl';

//Services
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLessonAsync, handleFilter } from '~/app/slices/lessonSlice';
import { selectLesson } from '~/app/selectors';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function LessonLayout({ children }) {
    const { topic } = useParams();
    const dispatch = useDispatch();
    const { lessonFilter } = useSelector(selectLesson).data;
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = handleSplitParam(topic);
                if (result) {
                    const lessonAll = await dispatch(getLessonAsync()).unwrap();
                    if (lessonAll) {
                        const lessonCurrents = lessonAll?.filter((lesson) => {
                            return lesson?.topicId === result;
                        });
                        if (lessonCurrents) {
                            dispatch(
                                handleFilter({
                                    lessonCurrents,
                                }),
                            );
                        }
                    }
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch, topic]);

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
                <div className={cx('tracks')}>
                    <Tracks data={lessonFilter} topicParameter={topic} />
                </div>
            </div>
            <FooterLesson data={lessonFilter} topicParameter={topic} />
        </div>
    );
}
LessonLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LessonLayout;
