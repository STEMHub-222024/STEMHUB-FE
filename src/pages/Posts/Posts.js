import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Posts.module.scss';
import PostItem from '~/components/Layouts/Components/PostItem';
import Heading from '~/components/Common/Heading';
import Pagination from '~/components/Common/Pagination';
import { getPostsAsync } from '~/app/slices/postSlice';
import { selectPosts } from '~/app/selectors';

const cx = classNames.bind(styles);

function Posts() {
    const dispatch = useDispatch();
    const { posts } = useSelector(selectPosts).data;
    const currentPageNew = localStorage.getItem('currentPage');
    const [currentPage, setCurrentPage] = useState(parseInt(currentPageNew) ?? 1);
    const [recordsPerPage] = useState(6);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = posts.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(posts.length / recordsPerPage);

    localStorage.setItem('currentPage', currentPage);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                await dispatch(getPostsAsync());
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };
        fetchApi();
    }, [dispatch]);
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

                            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Posts;
