import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { IconSquareRoundedXFilled, IconLoader, IconSearch } from '@tabler/icons-react';

import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';
import Button from '~/components/Common/Button';
import Heading from '~/components/Common/Heading';
import SearchCourseItem from '~/components/Layouts/Components/SearchCourseItem';
import { Wrapper as PopperWrapper } from '~/components/Common/Popper';

//Services
import { useDispatch, useSelector } from 'react-redux';
import { searchTopicAsync, updateTopicSearch } from '~/app/slices/searchSlice';
import { selectSearch } from '~/app/selectors';

//Clear fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function Search({ currentUser }) {
    const dispatch = useDispatch();
    const { searchTopics, loading } = useSelector(selectSearch).data;
    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    const inputRef = useRef();

    useEffect(() => {
        if (!debouncedValue.trim()) {
            dispatch(updateTopicSearch([]));
            return;
        }
        const fetchApi = async () => {
            try {
                const result = await dispatch(
                    searchTopicAsync({
                        topicKey: debouncedValue,
                    }),
                ).unwrap();

                // await Promise.all([searchTopic, searchLesson])
                //     .then(function ([resultTopic, resultLesson]) {
                //         console.log('result', resultTopic.concat(resultLesson));
                //     })
                //     .catch(function (err) {
                //         console.log(err.response.data.message);
                //     });

                if (result === undefined) {
                    dispatch(updateTopicSearch([]));
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch, debouncedValue]);

    const handleClear = () => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    return (
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchTopics.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <Heading h3 className={cx('search-title')}>
                                Topic
                            </Heading>
                            {searchTopics.length > 0 ? (
                                searchTopics.map((result) => (
                                    <SearchCourseItem
                                        key={result.topicId}
                                        data={result}
                                        setSearchValue={setSearchValue}
                                    />
                                ))
                            ) : (
                                <div className={cx('wrapper')}>
                                    {/* {console.log('1')} suy nghĩ */}
                                    <h2>Không tìm thấy kết quả!</h2>
                                </div>
                            )}
                            {/* <Heading h3 className={cx('search-title')}>
                                Posts
                            </Heading> */}
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
                        placeholder="Want to learn?"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {currentUser ? (
                        <>
                            {!!searchValue && !loading && (
                                <button className={cx('clear')} onClick={handleClear}>
                                    <IconSquareRoundedXFilled size={20} stroke={2} />
                                </button>
                            )}
                            {loading && <IconLoader className={cx('loading')} size={20} stroke={2} />}
                        </>
                    ) : (
                        <>
                            {!!searchValue && !loading && (
                                <button className={cx('clear-update')} onClick={handleClear}>
                                    <IconSquareRoundedXFilled size={20} stroke={2} />
                                </button>
                            )}
                            {loading && <IconLoader className={cx('loading-update')} size={20} stroke={2} />}
                        </>
                    )}

                    <Button mainColor small className={cx('search-btn')}>
                        Explore
                    </Button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

Search.propTypes = {
    currentUser: PropTypes.bool,
};

export default Search;
