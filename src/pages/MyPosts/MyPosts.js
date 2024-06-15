import classNames from 'classnames/bind';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Pagination } from 'antd';
import { getPostsAsync } from '~/app/slices/postSlice';
import MyPostsItem from '~/components/Layouts/Components/MyPostsItem';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { selectAuth } from '~/app/selectors';
import styles from './MyPosts.module.scss';

const cx = classNames.bind(styles);

function MyPosts() {
    const dispatch = useDispatch();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const [resetToken, setResetToken] = useState(false);
    const [myPosts, setMyPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem('currentPage')) || 1);
    const [pageSize, setPageSize] = useState(Number(localStorage.getItem('pageSize')) || 4);

    useLayoutEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch, resetToken]);

    const fetchPosts = async () => {
        if (!infoUserCurrent.userId) {
            setResetToken(!resetToken);
        } else {
            try {
                const res = await dispatch(getPostsAsync()).unwrap();
                if (res) {
                    const filterPosts = res.filter((item) => item.userId === infoUserCurrent.userId);
                    setMyPosts(filterPosts);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [dispatch, infoUserCurrent, resetToken]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
        localStorage.setItem('pageSize', pageSize);
    }, [currentPage, pageSize]);

    const totalPosts = myPosts.length;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Card title="Bài viết của tôi">
                    {myPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                        <MyPostsItem key={item.newspaperArticleId} data={item} onPostDeleted={fetchPosts} />
                    ))}
                </Card>
                <Pagination
                    className={cx('pagination')}
                    current={currentPage}
                    total={totalPosts}
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }}
                />
            </div>
        </div>
    );
}

export default MyPosts;
