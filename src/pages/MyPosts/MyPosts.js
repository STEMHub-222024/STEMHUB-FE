import classNames from 'classnames/bind';
import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Pagination, Empty, Typography } from 'antd';
import { getPostsAsync } from '~/app/slices/postSlice';
import MyPostsItem from '~/components/Layouts/Components/MyPostsItem';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { selectAuth } from '~/app/selectors';
import styles from './MyPosts.module.scss';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import routes from '~/config/routes';

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

    const fetchPosts = useCallback(async () => {
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
    }, [dispatch, infoUserCurrent.userId, resetToken]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
        localStorage.setItem('pageSize', pageSize);
    }, [currentPage, pageSize]);

    const totalPosts = myPosts.length;

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Card title="Bài viết của tôi">
                    {myPosts && myPosts.length > 0 ? (
                        myPosts.map((item) => (
                            <MyPostsItem key={item.newspaperArticleId} data={item} onPostDeleted={fetchPosts} />
                        ))
                    ) : (
                        <Empty
                            image={images.empty}
                            imageStyle={{
                                height: 60,
                            }}
                            description={
                                <Typography.Text>
                                    <p>Bạn không có bài viết nào!</p>
                                </Typography.Text>
                            }
                        >
                            <div className={cx('wrapper-btn')}>
                                <Button outline small rounded to={routes.newPost} className={cx('btn-next-posts')}>
                                    Đăng bài ngay
                                </Button>
                            </div>
                        </Empty>
                    )}
                </Card>
                {myPosts && myPosts.length > 0 && (
                    <Pagination
                        className={cx('pagination')}
                        current={currentPage}
                        total={totalPosts}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default MyPosts;
