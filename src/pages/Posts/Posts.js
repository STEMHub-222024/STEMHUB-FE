import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Posts.module.scss';
import PostItem from '~/components/Layouts/Components/PostItem';
import Heading from '~/components/Common/Heading';
import Pagination from '~/components/Common/Pagination';
import { getPostsAllAsync } from '~/app/slices/postSlice';
import { selectPosts } from '~/app/selectors';

const cx = classNames.bind(styles);

function Posts() {
    const dispatch = useDispatch();
    const { posts } = useSelector(selectPosts).data;

    const currentPageNew = localStorage.getItem('currentPage');
    let initialPage = currentPageNew ? parseInt(currentPageNew, 10) : 1;

    if (isNaN(initialPage) || initialPage <= 0) {
        initialPage = 1;
    }

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [recordsPerPage] = useState(6);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getPostsAllAsync()).unwrap();
            } catch (rejectedValueOrSerializedError) {}
        };
        fetchApi();
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const indexOfLastRecord = useMemo(() => currentPage * recordsPerPage, [currentPage, recordsPerPage]);
    const indexOfFirstRecord = useMemo(() => indexOfLastRecord - recordsPerPage, [indexOfLastRecord, recordsPerPage]);
    const currentRecords = useMemo(
        () => posts.slice(indexOfFirstRecord, indexOfLastRecord),
        [posts, indexOfFirstRecord, indexOfLastRecord],
    );
    const nPages = useMemo(() => Math.ceil(posts.length / recordsPerPage), [posts.length, recordsPerPage]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('posts-content')}>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-12')}>
                            <div className={cx('group-title')}>
                                <Heading className={cx('heading')}>Bài viết nổi bật</Heading>
                                <div className={cx('desc')}>
                                    <p>
                                        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ
                                        thuật lập trình web.
                                    </p>
                                </div>
                            </div>
                            {currentRecords.map((data, index) => (
                                <PostItem key={index} data={data} />
                            ))}
                            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Posts;
