import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTopicSearch } from '~/app/slices/searchSlice';
import styles from './SearchCourseItem.module.scss';

const cx = classNames.bind(styles);
const CLASSES = {
    wrapper: cx('wrapper'),
    avatar: cx('avatar'), 
    name: cx('name')
};

const Image = lazy(() => import('~/components/Common/Image'));

const SearchCourseItem = memo(({ 
    topicData, 
    newspaperArticleData, 
    setSearchValue, 
    isKeyword = false,
    ...passProps 
}) => {
    const dispatch = useDispatch();

    const { link, imageSrc, altText, name } = useMemo(() => ({
        link: getItemLink(topicData, newspaperArticleData),
        imageSrc: getImageSource(topicData, newspaperArticleData),
        altText: getName(topicData, newspaperArticleData),
        name: getName(topicData, newspaperArticleData)
    }), [topicData, newspaperArticleData]);

    const handleHideResult = useCallback(() => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));

    }, [dispatch, setSearchValue]);

    const componentProps = {
        ...passProps,
        ...(isKeyword ? {} : { to: link }),
        className: CLASSES.wrapper,
        onClick: handleHideResult
    };

    return (
        <Link {...componentProps}>
            {!isKeyword && (
                <Suspense fallback={<div>Loading...</div>}>
                    <Image 
                        className={CLASSES.avatar} 
                        src={imageSrc} 
                        alt={altText} 
                    />
                </Suspense>
            )}
            <span className={CLASSES.name}>{name}</span>
        </Link>
    );
});


const getItemLink = (topicData, newspaperArticleData) => {
    if (topicData) return `/topic/${topicData.topicId}`;
    if (newspaperArticleData) return `/posts/${newspaperArticleData.newspaperArticleId}`;
    return '/';
};

const getImageSource = (topicData, newspaperArticleData) => {
    if (topicData) return topicData.topicImage;
    if (newspaperArticleData) return newspaperArticleData.image;
    return '';
};

const getName = (topicData, newspaperArticleData) => {
    if (topicData) return topicData.topicName;
    if (newspaperArticleData) return newspaperArticleData.title;
    return '';
};

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