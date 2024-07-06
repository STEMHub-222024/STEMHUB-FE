import classNames from 'classnames/bind';
import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { Space, Table, Layout, Button, message, Input, Tooltip, Form, Modal, Select, Upload } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import Heading from '~/components/Common/Heading';
import * as postServices from '~/services/postServices';
import * as userServices from '~/services/userServices';
import { postImage, deleteImage } from '~/services/uploadImage';
import styles from './Posts.module.scss';

const { Content } = Layout;
const { Option } = Select;

const cx = classNames.bind(styles);

function Posts() {
    const [imageList, setImageList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [users, setUsers] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);

    const fetchPosts = async () => {
        const [postRes, userRes] = await Promise.all([postServices.getPosts(), userServices.getUseAll()]);

        if (postRes && userRes) {
            const usersById = userRes.reduce((acc, user) => {
                acc[user.id] = user.userName;
                return acc;
            }, {});

            const mergedData = postRes.map((post) => ({
                ...post,
                userName: usersById[post.userId] || 'Unknown',
                create_at: moment(post.create_at).format('YYYY-MM-DD HH:mm:ss'),
            }));

            setImageList(mergedData);
        }
    };

    const fetchUsers = async () => {
        const userRes = await userServices.getUseAll();
        if (userRes) {
            setUsers(userRes);
        }
    };

    const handleDelete = async (newspaperArticleId) => {
        await postServices.deletePosts(newspaperArticleId);
        message.success('Post deleted successfully');
        fetchPosts();
    };

    const handleSave = async (values) => {
        try {
            if (editingPost) {
                await postServices.updatePost(editingPost.newspaperArticleId, values);
                message.success('Post updated successfully');
            } else {
                await postServices.addPost(values);
                message.success('Post created successfully');
            }
            fetchPosts();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Error saving post');
        }
    };

    const handleAdd = () => {
        setEditingPost(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPost(record);
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

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => handleDelete(record.newspaperArticleId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Lesson</Heading>
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
                dataSource={imageList}
                rowKey="newspaperArticleId"
            />
            <Modal
                title={editingPost ? 'Edit Post' : 'Add Post'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    initialValues={editingPost || { title: '', description_NA: '', image: '', userId: '' }}
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input placeholder="Enter a title" />
                    </Form.Item>
                    <Form.Item
                        name="description_NA"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input placeholder="Enter a description" />
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
                    <Form.Item
                        name="userId"
                        label="User"
                        rules={[{ required: true, message: 'Please select the user!' }]}
                    >
                        <Select placeholder="Select a user">
                            {users.map((user) => {
                                return (
                                    <Option key={user.id} value={user.id}>
                                        {user.userName}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingPost ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Posts;
