import classNames from 'classnames/bind';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import Heading from '~/components/Common/Heading';

import { postImage, deleteImage } from '~/services/uploadImage';
import TextEditor from '~/components/Common/TextEditor';
import { selectPosts } from '~/app/selectors';
import { setMarkdown, setHtmlContent } from '~/app/slices/postSlice';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Space, Table, Layout, Button, message, Input, Tooltip, Form, Modal, Upload } from 'antd';
import * as scientistServices from '~/services/scientistServices';
import styles from './Scientist.module.scss';

const { Content } = Layout;

const cx = classNames.bind(styles);

function Scientist() {
    const textEditorRef = useRef();
    const dispatch = useDispatch();
    const { markdown, htmlContent } = useSelector(selectPosts).data;
    const [scientistList, setScientistList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingScientist, setEditingScientist] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchScientist();
    }, []);

    const fetchScientist = async () => {
        const response = await scientistServices.getScientist();
        if (response) {
            setScientistList(response);
        }
    };

    const handleClearEditor = () => {
        if (textEditorRef.current) {
            textEditorRef.current.clearEditorContent();
        }
    };

    const handleDelete = async (scientistId) => {
        await scientistServices.deleteScientist(scientistId);
        message.success('Scientist deleted successfully');
        fetchScientist();
    };

    const handleSave = async (values) => {
        const hide = message.loading('Đang xuất bản...', 0);
        try {
            values.image = backgroundImage;
            const scientistData = {
                ...values,
                contentMarkdown: markdown,
                content: htmlContent,
            };

            console.log('scientistData', scientistData);
            if (editingScientist) {
                await scientistServices.updateScientist(editingScientist.scientistId, scientistData);
                hide();
                message.success('Scientist updated successfully');
            } else {
                await scientistServices.addScientist(scientistData);
                hide();
                message.success('Scientist created successfully');
            }
            fetchScientist();
            setIsModalVisible(false);
            handleClearEditor();
        } catch (error) {
            hide();
            message.error('Error saving post');
        }
    };

    const handleAdd = () => {
        setEditingScientist(null);
        form.resetFields();
        setBackgroundImage(null);
        setFileList([]);
        dispatch(setMarkdown(''));
        dispatch(setHtmlContent(''));
        form.setFieldsValue({
            fullName: '',
            adage: '',
            descriptionScientist: '',
            image: undefined,
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingScientist(record);
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
        dispatch(setMarkdown(record.contentMarkdown));
        dispatch(setHtmlContent(record.content));
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
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            ...getColumnSearchProps('fullName'),
            ellipsis: true,
            onFilter: (value, record) => record.fullName.includes(value),
            sorter: (a, b) => (a.fullName || '').length - (b.fullName || '').length,
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
            title: 'Adage',
            dataIndex: 'adage',
            key: 'adage',
            ellipsis: {
                showTitle: false,
            },
            render: (adage) => (
                <Tooltip placement="topLeft" title={adage}>
                    {adage}
                </Tooltip>
            ),
        },
        {
            title: 'Short Description',
            dataIndex: 'descriptionScientist',
            key: 'descriptionScientist',
            ellipsis: {
                showTitle: false,
            },
            render: (descriptionScientist) => (
                <Tooltip placement="topLeft" title={descriptionScientist}>
                    {descriptionScientist}
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
                    <Button type="link" onClick={() => handleDelete(record.scientistId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Scientist</Heading>
                <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                    Add Scientist
                </Button>
            </Space>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => <p dangerouslySetInnerHTML={{ __html: record.content ?? '' }}></p>,
                }}
                dataSource={scientistList}
                rowKey="scientistId"
            />

            <Modal
                title={editingScientist ? 'Edit Scientist' : 'Add Scientist'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <Form
                    layout="vertical"
                    initialValues={editingScientist || { fullName: '', adage: '', userId: '' }}
                    onFinish={handleSave}
                    form={form}
                >
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter the full name' }]}
                    >
                        <Input placeholder="Enter a full name" />
                    </Form.Item>

                    <Form.Item
                        name="adage"
                        label="Adage"
                        rules={[{ required: true, message: 'Please enter the adage' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter a adage" />
                    </Form.Item>

                    <Form.Item
                        name="descriptionScientist"
                        label="Short Description"
                        rules={[{ required: true, message: 'Please enter the short description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter a short description" />
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

export default Scientist;
