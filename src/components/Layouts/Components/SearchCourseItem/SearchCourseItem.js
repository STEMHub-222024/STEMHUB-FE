import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SearchCourseItem.module.scss';
import { Link } from 'react-router-dom';

import Image from '~/components/Common/Image';

import { useDispatch } from 'react-redux';
import { updateTopicSearch } from '~/app/slices/searchSlice';

const cx = classNames.bind(styles);

function SearchCourseItem({ ...props }) {
    const dispatch = useDispatch();
    const { topicData, newspaperArticleData, setSearchValue } = props;

    const handleHideResult = () => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
    };
    return (
        <Link
            to={
                (topicData && `/topic/${topicData?.topicName}=${topicData?.topicId}`) ||
                (newspaperArticleData && `/posts/${newspaperArticleData?.newspaperArticleId}`)
            }
            className={cx('wrapper')}
            onClick={() => handleHideResult()}
        >
            <Image
                className={cx('avatar')}
                src={(topicData && topicData?.topicImage) || (newspaperArticleData && newspaperArticleData?.image)}
                alt={(topicData && topicData?.topicName) || (newspaperArticleData && newspaperArticleData?.title)}
            />
            <span className={cx('name')}>
                {(topicData && topicData?.topicName) || (newspaperArticleData && newspaperArticleData?.title)}
            </span>
        </Link>
    );
}

SearchCourseItem.propTypes = {
    data: PropTypes.object,
    setSearchValue: PropTypes.func,
};

export default SearchCourseItem;
