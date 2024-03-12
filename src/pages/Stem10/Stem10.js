import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import classNames from 'classnames/bind';
import styles from './Stem10.module.scss';
import Topic from '~/components/Layouts/Components/Topic';

// Services
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopicAsync } from '~/app/slices/topicSlice';
import { selectTopic } from '~/app/selectors';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);
function Stem10() {
    const dispatch = useDispatch();
    const { data } = useSelector(selectTopic);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getTopicAsync()).unwrap();
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('grid-row', { content: 'content' })}>
                    {data?.map((shine) => {
                        const randomColor = tinycolor.random().toString();
                        return (
                            <div key={shine.topicId} className={cx('grid-column-3')}>
                                <Topic colorCode={randomColor} shine={shine} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

Stem10.propTypes = {};

export default Stem10;
