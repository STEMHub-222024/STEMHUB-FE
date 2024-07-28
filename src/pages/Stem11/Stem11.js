import { memo, useState, useEffect } from 'react';
import tinycolor from 'tinycolor2';
import classNames from 'classnames/bind';
import styles from './Stem11.module.scss';
import Topic from '~/components/Layouts/Components/Topic';
import Loading from '~/components/Common/Loading';

// Services
import { useDispatch } from 'react-redux';
import { getTopicAsync } from '~/app/slices/topicSlice';
import * as stemServices from '~/services/stemServices';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Stem11() {
    const dispatch = useDispatch();
    const [listStem11, setListStem11] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await dispatch(getTopicAsync()).unwrap();
                if (res) {
                    const stemNamePromises = res.map(async (topic) => {
                        const stem = await stemServices.getStemById(topic.stemId);
                        if (!stem) return null;
                        return {
                            stemId: stem.stemId,
                            stemName: stem?.stemName,
                            ...topic,
                        };
                    });

                    const stemNameResults = await Promise.all(stemNamePromises);
                    if (stemNameResults) {
                        const stem11Regex = /^stem\s*11$/i;

                        const stem11s = stemNameResults.filter((stem) => {
                            return stem11Regex.test(stem.stemName);
                        });

                        if (stem11s) {
                            setListStem11(stem11s);
                        }
                    }
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    if (loading) {
        return <Loading title="Đang tải...." />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('grid-row', { content: 'content' })}>
                    {listStem11?.map((shine) => {
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

export default memo(Stem11);
