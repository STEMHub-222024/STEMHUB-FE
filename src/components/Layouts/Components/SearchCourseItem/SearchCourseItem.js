import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { memo } from 'react';
import styles from './SearchCourseItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Common/Image';
import { useDispatch } from 'react-redux';
import { updateTopicSearch } from '~/app/slices/searchSlice';

const cx = classNames.bind(styles);

const SearchCourseItem = memo(({ topicData, newspaperArticleData, setSearchValue }) => {
    const dispatch = useDispatch();

    // Function to handle hiding search results
    const handleHideResult = () => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
    };

    // Determine the link
    const link = topicData
        ? `/topic/${topicData.topicName}=${topicData.topicId}`
        : newspaperArticleData
        ? `/posts/${newspaperArticleData.newspaperArticleId}`
        : '/';

    const imageSrc = topicData ? topicData.topicImage : newspaperArticleData ? newspaperArticleData.image : '';

    const altText = topicData ? topicData.topicName : newspaperArticleData ? newspaperArticleData.title : '';

    const name = topicData ? topicData.topicName : newspaperArticleData ? newspaperArticleData.title : '';

    return (
        <Link to={link} className={cx('wrapper')} onClick={handleHideResult}>
            <Image className={cx('avatar')} src={imageSrc} alt={altText} />
            <span className={cx('name')}>{name}</span>
        </Link>
    );
});

SearchCourseItem.propTypes = {
    topicData: PropTypes.object,
    newspaperArticleData: PropTypes.object,
    setSearchValue: PropTypes.func.isRequired,
};

export default SearchCourseItem;
