import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { IconSquareRoundedXFilled, IconLoader, IconSearch } from '@tabler/icons-react';

// import * as searchServices from '~/services/searchServices';
import Button from '~/components/Common/Button';
import { Wrapper as PopperWrapper } from '~/components/Common/Popper';
import SearchCourseItem from '~/components/Common/SearchCourseItem';
import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search({ currentUser }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(searchValue, 500);

    const inputRef = useRef();

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);

            // const result = await searchServices.search(debouncedValue);

            setSearchResult([
                {
                    maKH: 1,
                    tenKH: 'công cụ hoá',
                    hinh: 'https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/428610209_891289042735105_7492010885795515272_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=c42490&_nc_eui2=AeEAmPm0bKjfF28Z6ynEq3DY-98yKOs3IJz73zIo6zcgnCHfb8lECPcLB2Juq_77BaDGA0d1feIKpABFnuFU9Lef&_nc_ohc=HSkd7RcJCvAAX-BtXPL&_nc_ht=scontent.fhan5-11.fna&oh=00_AfCRpG_PlJfuG8fj8EtuC2zXxhU0iA65NWccA2Fmv4j8_A&oe=65D9BF8F',
                },
            ]);

            // if (result === undefined) {
            //     setSearchResult([]);
            // } else {
            //     setSearchResult(result);
            //     setLoading(false);
            // }

            setLoading(false);
        };
        fetchApi();
    }, [debouncedValue]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
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
                visible={showResult && searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>KHÓA HỌC</h4>
                            {searchResult.map((result) => (
                                <SearchCourseItem
                                    key={result.maKH}
                                    data={result}
                                    setSearchResult={setSearchResult}
                                    setSearchValue={setSearchValue}
                                />
                            ))}
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

export default Search;
