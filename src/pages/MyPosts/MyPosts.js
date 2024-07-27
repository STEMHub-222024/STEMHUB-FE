import classNames from 'classnames/bind';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Pagination, Empty, Typography, Modal, Form, message, Input, Space, Button, Upload } from 'antd';
import { getPostsAsync } from '~/app/slices/postSlice';
import { selectAuth } from '~/app/selectors';
import TextEditor from '~/components/Common/TextEditor';
import MyPostsItem from '~/components/Layouts/Components/MyPostsItem';
import styles from './MyPosts.module.scss';
import images from '~/assets/images';
import ButtonHome from '~/components/Common/Button';
import routes from '~/config/routes';
import { UploadOutlined } from '@ant-design/icons';
import { postImage, deleteImage } from '~/services/uploadImage';
import * as postServices from '~/services/postServices';
import { selectPosts } from '~/app/selectors';
import { setMarkdown, setHtmlContent } from '~/app/slices/postSlice';

const cx = classNames.bind(styles);

function MyPosts() {
    const dispatch = useDispatch();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const { markdown, htmlContent } = useSelector(selectPosts).data;
    const [myPosts, setMyPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem('currentPage')) || 1);
    const [pageSize, setPageSize] = useState(Number(localStorage.getItem('pageSize')) || 4);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const fetchPosts = useCallback(async () => {
        try {
            const res = await dispatch(getPostsAsync()).unwrap();
            if (res) {
                const filterPosts = res.filter((item) => item.userId === infoUserCurrent.userId);
                setMyPosts(filterPosts);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    }, [dispatch, infoUserCurrent.userId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
        localStorage.setItem('pageSize', pageSize);
    }, [currentPage, pageSize]);

    const totalPosts = useMemo(() => myPosts.length, [myPosts]);

    const handlePageChange = useCallback((page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    }, []);

    const handlePostEdit = useCallback(
        (post) => {
            setEditingPost(post);
            form.setFieldsValue(post);
            setBackgroundImage(post.image);
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: post.image,
                },
            ]);
            dispatch(setMarkdown(post.markdown));
            dispatch(setHtmlContent(post.htmlContent));
            setIsEditModalVisible(true);
        },
        [dispatch, form],
    );

    const handleEditSubmit = useCallback(
        async (values) => {
            const hide = message.loading('Đang cập nhật...', 0);
            try {
                values.image = backgroundImage;
                const postData = {
                    ...values,
                    markdown,
                    htmlContent,
                };
                await postServices.updatePost(editingPost.newspaperArticleId, postData);
                message.success('Cập nhật bài viết thành công!');
                hide();
                setIsEditModalVisible(false);
                await fetchPosts();
            } catch (error) {
                hide();
                message.error('Cập nhật bài viết thất bại!');
            }
        },
        [backgroundImage, editingPost, fetchPosts, markdown, htmlContent],
    );

    const handleFileChange = useCallback(
        async (event) => {
            const currentImageURL = backgroundImage;

            if (event.file) {
                const file = event.file;
                try {
                    if (currentImageURL) {
                        const nameImage = currentImageURL.split('uploadimage/')[1];
                        await deleteImage(nameImage);
                        return;
                    }
                    const imageURL = await postImage(file);
                    setBackgroundImage(imageURL.fileUrl);
                    setFileList([
                        {
                            uid: '-1',
                            name: file.name,
                            status: 'done',
                            url: imageURL.fileUrl,
                        },
                    ]);
                } catch (error) {
                    message.error('Image upload failed!');
                }
            }
        },
        [backgroundImage],
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Card title="Bài viết của tôi">
                    {myPosts.length > 0 ? (
                        myPosts.map((item) => (
                            <MyPostsItem
                                key={item.newspaperArticleId}
                                data={item}
                                onPostDeleted={fetchPosts}
                                onPostEdit={handlePostEdit}
                            />
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
                                <ButtonHome outline small rounded to={routes.newPost} className={cx('btn-next-posts')}>
                                    Đăng bài ngay
                                </ButtonHome>
                            </div>
                        </Empty>
                    )}
                </Card>
                <Modal
                    title="Chỉnh sửa bài viết"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                    width={1000}
                >
                    <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
                        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                        <Form.Item name="description_NA" label="Mô tả" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung">
                            <div className={cx('text-editor')}>
                                <TextEditor
                                    className={cx('text-content')}
                                    showHtml
                                    placeholder="Nội dung viết ở đây"
                                    initialContent={{ markdown, htmlContent }}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            rules={[{ required: true, message: 'Please upload an image!' }]}
                        >
                            <Upload
                                listType="picture"
                                fileList={fileList}
                                maxCount={1}
                                onRemove={() => {
                                    setBackgroundImage(null);
                                    setFileList([]);
                                }}
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Space style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button onClick={() => setIsEditModalVisible(false)}>Hủy bỏ</Button>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
                {myPosts.length > 0 && (
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
