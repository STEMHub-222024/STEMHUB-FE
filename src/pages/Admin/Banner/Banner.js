import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Upload, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Heading from '~/components/Common/Heading';
import * as bannerServices from '~/services/bannerServices';
import { postImage, deleteImage } from '~/services/uploadImage';

import styles from './Banner.module.scss';

const cx = classNames.bind(styles);

const { Content } = Layout;

function Banner() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [bannerList, setBannerList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const res = await bannerServices.getBanner();
        if (res) {
            setBannerList(res);
        }
    };

    const handleAdd = () => {
        setCurrentBanner(null);
        form.resetFields();
        setBackgroundImage(null);
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentBanner(record);
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
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await bannerServices.deleteBanner(id);
        message.success('Banner deleted successfully');
        fetchBanners();
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        values.image = backgroundImage;

        if (currentBanner) {
            await bannerServices.updateBanner(currentBanner.bannerId, values);
            message.success('Banner updated successfully');
        } else {
            await bannerServices.addBanner(values);
            message.success('Banner added successfully');
        }
        setIsModalVisible(false);
        fetchBanners();
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

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            filteredValue: filteredInfo.title || null,
            onFilter: (value, record) => record.title.includes(value),
            sorter: (a, b) => a.title.length - b.title.length,
            sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            ellipsis: {
                showTitle: false,
            },
            render: (content) => (
                <Tooltip placement="topLeft" title={content}>
                    {content}
                </Tooltip>
            ),
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => handleDelete(record.bannerId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Banner</Heading>
                <Button type="primary" onClick={handleAdd}>
                    Add Banner
                </Button>
            </Space>
            <Table columns={columns} dataSource={bannerList} onChange={handleChange} rowKey="bannerId" />
            <Modal
                title={currentBanner ? 'Edit Banner' : 'Add Banner'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input placeholder="Enter the Title" />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                        <Input placeholder="Enter the Content" />
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
                </Form>
            </Modal>
        </Content>
    );
}

export default Banner;
