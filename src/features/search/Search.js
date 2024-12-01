import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { IconSquareRoundedXFilled, IconLoader, IconSearch } from '@tabler/icons-react';
import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';
import Button from '~/components/Common/Button';
import Heading from '~/components/Common/Heading';
import SearchCourseItem from '~/components/Layouts/Components/SearchCourseItem';
import { Wrapper as PopperWrapper } from '~/components/Common/Popper';

// Services
import { useDispatch, useSelector } from 'react-redux';
import {
    searchTopicAsync,
    updateTopicSearch,
    searchNewspaperArticleAsync,
    updatePostsSearch,
    searchTopKeywordsAsync,
} from '~/app/slices/searchSlice';
import { selectSearch } from '~/app/selectors';

const cx = classNames.bind(styles);

function Search({ currentUser }) {
    const dispatch = useDispatch();
    const { searchTopics, loading, searchPosts, searchTopKeywords } = useSelector(selectSearch).data;
    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const inputRef = useRef();
    const [isFirstFocus, setIsFirstFocus] = useState(true);

    const fetchApi = useCallback(async () => {
        if (!debouncedValue.trim()) {
            dispatch(updateTopicSearch([]));
            dispatch(updatePostsSearch([]));
            return;
        }

        try {
            const [topicsResult, newspaperArticleResult] = await Promise.allSettled([
                dispatch(searchTopicAsync({ topicKey: debouncedValue })).unwrap(),
                dispatch(searchNewspaperArticleAsync({ newspaperArticleKey: debouncedValue })).unwrap(),
            ]);

            if (topicsResult.status === 'fulfilled') {
                dispatch(updateTopicSearch(topicsResult.value));
            } else {
                dispatch(updateTopicSearch([]));
            }

            if (newspaperArticleResult.status === 'fulfilled') {
                dispatch(updatePostsSearch(newspaperArticleResult.value));
            } else {
                dispatch(updatePostsSearch([]));
            }
        } catch (error) { }
    }, [dispatch, debouncedValue]);

    useEffect(() => {
        fetchApi();
        return () => { };
    }, [fetchApi]);

    const handleClear = useCallback(() => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
        inputRef.current.focus();
    }, [dispatch]);

    const handleHideResult = useCallback(() => {
        setShowResult(false);
    }, []);

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
        }
    }, []);

    const handleFocus = useCallback(() => {
        setShowResult(true);
        if (isFirstFocus) {
            dispatch(searchTopKeywordsAsync());
            setIsFirstFocus(false);
        }
    }, [dispatch, isFirstFocus]);

    const showResults = useMemo(
        () =>
            (Array.isArray(searchTopics) && searchTopics.length > 0) ||
            (Array.isArray(searchPosts) && searchPosts.length > 0) ||
            (!searchValue && Array.isArray(searchTopKeywords) && searchTopKeywords.length > 0),
        [searchTopics, searchPosts, searchTopKeywords, searchValue],
    );

    return (
        <div className={cx('wrapper')}>
            <HeadlessTippy
                interactive
                visible={showResult && showResults}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <div>
                                {!searchValue && Array.isArray(searchTopKeywords) && searchTopKeywords.length > 0 && (
                                    <>
                                        <Heading h3 className={cx('search-title')}>
                                            Từ khóa phổ biến
                                        </Heading>
                                        <div className={cx('keyword-list')}>
                                            {searchTopKeywords.map((keyword, index) => (

                                                <SearchCourseItem
                                                    key={`keyword-${index}`}
                                                    topicData={
                                                        {
                                                            topicId: `keyword-${index}`,
                                                            topicName: keyword.searchKeyword
                                                        }
                                                    }
                                                    setSearchValue={() => setSearchValue(keyword.searchKeyword)}
                                                    isKeyword
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {Array.isArray(searchTopics) && searchTopics.length > 0 && (
                                    <>
                                        <Heading h3 className={cx('search-title')}>
                                            Chủ đề
                                        </Heading>
                                        {searchTopics.map((topicResult) => (
                                            <SearchCourseItem
                                                key={`topic-${topicResult.topicId}`}
                                                topicData={topicResult}
                                                setSearchValue={setSearchValue}
                                            />
                                        ))}
                                    </>
                                )}

                                {Array.isArray(searchPosts) && searchPosts.length > 0 && (
                                    <>
                                        <hr />
                                        <Heading h3 className={cx('search-title')}>
                                            Bài viết
                                        </Heading>
                                        {searchPosts.map((searchPostsResult) => (
                                            <SearchCourseItem
                                                key={`post-${searchPostsResult.newspaperArticleId}`}
                                                newspaperArticleData={searchPostsResult}
                                                setSearchValue={setSearchValue}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <IconSearch className={cx('icon-search')} size={20} />
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm chủ đề, bài viết....."
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        className={cx('input-search')}
                    />
                    {currentUser && currentUser.isUser ? (
                        <>
                            {loading && <IconLoader className={cx('clear')} size={20} stroke={2} />}
                            {!!searchValue && !loading && (
                                <button className={cx('clear')} onClick={handleClear}>
                                    <IconSquareRoundedXFilled size={20} stroke={2} />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {loading && <IconLoader className={cx('clear-update')} size={20} stroke={2} />}
                            {!!searchValue && !loading && (
                                <button className={cx('clear-update')} onClick={handleClear}>
                                    <IconSquareRoundedXFilled size={20} stroke={2} />
                                </button>
                            )}
                        </>
                    )}

                    <Button mainColor small className={cx('search-btn')}>
                        Tìm kiếm
                    </Button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
