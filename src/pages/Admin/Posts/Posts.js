import classNames from 'classnames/bind';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import Heading from '~/components/Common/Heading';
import * as postServices from '~/services/postServices';
import * as userServices from '~/services/userServices';
import { postImage, deleteImage } from '~/services/uploadImage';
import TextEditor from '~/components/Common/TextEditor';
import { selectPosts } from '~/app/selectors';
import { setMarkdown, setHtmlContent } from '~/app/slices/postSlice';
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Table, Layout, Button, message, Input, Tooltip, Form, Modal, Select, Upload } from 'antd';
import Loading from '~/components/Common/Loading';

import styles from './Posts.module.scss';

const { Content } = Layout;
const { Option } = Select;

const cx = classNames.bind(styles);

function Posts() {
    const textEditorRef = useRef();
    const dispatch = useDispatch();
    const { markdown, htmlContent } = useSelector(selectPosts).data || {};
    const [postList, setPostList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const [postRes, userRes] = await Promise.all([postServices.getPosts(), userServices.getUseAll()]);

        if (postRes && userRes) {
            const usersById = userRes.reduce((acc, user) => {
                acc[user.id] = user.userName;
                return acc;
            }, {});
            const mergedData = postRes.map((post) => ({
                ...post.article,
                userName: usersById[post.article.userId] || '',
                create_at: moment(post.article.create_at).format('YYYY-MM-DD HH:mm:ss'),
            })); 

            setPostList(mergedData);
        }

        setLoading(false);
    };

    const fetchUsers = async () => {
        const userRes = await userServices.getUseAll();
        if (userRes) {
            setUsers(userRes);
        }
    };

    const handleClearEditor = () => {
        if (textEditorRef.current) {
            textEditorRef.current.clearEditorContent();
        }
    };

    const handleDelete = async (newspaperArticleId) => {
        const hide = message.loading('Đang xóa...', 0);
        try {
            await postServices.deletePosts(newspaperArticleId);
            hide();
            message.success('Post deleted successfully');
            fetchPosts();
        } catch (error) {
            hide();
            message.error('Error deleting post');
        }
    };

    const handleSave = async (values) => {
        const hide = message.loading('Đang xuất bản...', 0);
        try {
            values.image = backgroundImage;
            const postData = {
                ...values,
                markdown,
                htmlContent,
            };

            if (editingPost) {
                await postServices.updatePost(editingPost.newspaperArticleId, postData);
                hide();
                message.success('Post updated successfully');
            } else {
                await postServices.addPost(postData);
                hide();
                message.success('Post created successfully');
            }
            fetchPosts();
            setIsModalVisible(false);
            handleClearEditor();
        } catch (error) {
            hide();
            message.error('Error saving post');
        }
    };

    const handleAdd = () => {
        setEditingPost(null);
        form.resetFields();
        setBackgroundImage(null);
        setFileList([]);
        dispatch(setMarkdown(''));
        dispatch(setHtmlContent(''));
        form.setFieldsValue({
            title: '',
            description_NA: '',
            userId: undefined,
            image: undefined,
        });

        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPost(record);
        form.setFieldsValue(record);
        setBackgroundImage(record.image);
        setFileList([
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: record.image,
            },
        ]);
        dispatch(setMarkdown(record.markdown));
        dispatch(setHtmlContent(record.htmlContent));
        setIsModalVisible(true);
    };

    const handleFileChange = async (event) => {
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
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title'),
            ellipsis: true,
            onFilter: (value, record) => record.title.includes(value),
            sorter: (a, b) => (a.title || '').length - (b.title || '').length,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            ellipsis: {
                showTitle: false,
            },
            render: (image) => (
                <Tooltip placement="topLeft" title={image}>
                    {image}
                </Tooltip>
            ),
        },
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            onFilter: (value, record) => record.userName.includes(value),
            sorter: (a, b) => (a.userName || '').length - (b.userName || '').length,
        },
        {
            title: 'Description',
            dataIndex: 'description_NA',
            key: 'description_NA',
            ellipsis: {
                showTitle: false,
            },
            render: (description_NA) => (
                <Tooltip placement="topLeft" title={description_NA}>
                    {description_NA}
                </Tooltip>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'create_at',
            key: 'create_at',
            ellipsis: {
                showTitle: false,
            },
            render: (create_at) => (
                <Tooltip placement="topLeft" title={create_at}>
                    {create_at}
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    <Button type="link" onClick={() => handleDelete(record.newspaperArticleId)} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    if (loading)  {
        return <Loading title='Đang tải....'/>
    }

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Post</Heading>
                <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                    Add Post
                </Button>
            </Space>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <p dangerouslySetInnerHTML={{ __html: record.htmlContent ?? '' }}></p>
                    ),
                }}
                dataSource={postList}
                rowKey="newspaperArticleId"
            />

            <Modal
                title={editingPost ? 'Edit Post' : 'Add Post'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <Form
                    layout="vertical"
                    initialValues={editingPost || { title: '', description_NA: '', userId: '' }}
                    onFinish={handleSave}
                    form={form}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter the title' }]}
                    >
                        <Input placeholder="Enter a title" />
                    </Form.Item>

                    <Form.Item
                        name="description_NA"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter a description" />
                    </Form.Item>

                    <Form.Item name="userId" label="User" rules={[{ required: true, message: 'Please select a user' }]}>
                        <Select placeholder="Select a user">
                            {users.map((user) => (
                                <Option key={user.id} value={user.id}>
                                    {user.userName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Content">
                        <div className={cx('text-editor')}>
                            <TextEditor
                                ref={textEditorRef}
                                className={cx('text-content')}
                                showHtml
                                placeholder="Nội dung viết ở đây"
                                initialContent={{ markdown, htmlContent }}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Image"
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
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                OK
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Posts;
