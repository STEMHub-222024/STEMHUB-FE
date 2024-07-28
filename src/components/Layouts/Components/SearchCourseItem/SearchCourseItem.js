import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTopicSearch } from '~/app/slices/searchSlice';
import styles from './SearchCourseItem.module.scss';

const cx = classNames.bind(styles);
const wrapperClass = cx('wrapper');
const avatarClass = cx('avatar');
const nameClass = cx('name');

const Image = lazy(() => import('~/components/Common/Image'));

const SearchCourseItem = memo(({ topicData, newspaperArticleData, setSearchValue }) => {
    const dispatch = useDispatch();

    const { link, imageSrc, altText, name } = useMemo(() => {
        const link = topicData
            ? `/topic/${topicData.topicId}`
            : newspaperArticleData
            ? `/posts/${newspaperArticleData.newspaperArticleId}`
            : '/';

        const imageSrc = topicData ? topicData.topicImage : newspaperArticleData ? newspaperArticleData.image : '';
        const altText = topicData ? topicData.topicName : newspaperArticleData ? newspaperArticleData.title : '';
        const name = topicData ? topicData.topicName : newspaperArticleData ? newspaperArticleData.title : '';

        return { link, imageSrc, altText, name };
    }, [topicData, newspaperArticleData]);

    const handleHideResult = useCallback(() => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
    }, [dispatch, setSearchValue]);

    return (
        <Link to={link} className={wrapperClass} onClick={handleHideResult}>
            <Suspense fallback={<div>Loading...</div>}>
                <Image className={avatarClass} src={imageSrc} alt={altText} />
            </Suspense>
            <span className={nameClass}>{name}</span>
        </Link>
    );
});

SearchCourseItem.propTypes = {
    topicData: PropTypes.shape({
        topicId: PropTypes.string.isRequired,
        topicImage: PropTypes.string.isRequired,
        topicName: PropTypes.string.isRequired,
    }),
    newspaperArticleData: PropTypes.shape({
        newspaperArticleId: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }),
    setSearchValue: PropTypes.func.isRequired,
};

export default SearchCourseItem;