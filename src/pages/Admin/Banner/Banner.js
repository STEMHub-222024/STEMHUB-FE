import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as bannerServices from '~/services/bannerServices';
import { postImage, deleteImage } from '~/services/uploadImage';

const { Content } = Layout;

function Banner() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [bannerList, setBannerList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
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
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentBanner(record);
        form.setFieldsValue(record);
        setBackgroundImage(record.image);
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
            await bannerServices.updateBanner(currentBanner.id, values);
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
        console.log('1', event, currentImageURL);
        if (event.file) {
            const file = event.file;
            try {
                if (currentImageURL) {
                    console.log('currentImageURL', currentImageURL.split('uploadimage/')[1]);
                    await deleteImage(currentImageURL.split('uploadimage/')[1]);
                }
                console.log('file', file);
                const imageURL = await postImage(file);
                console.log('imageURL', imageURL);
                setBackgroundImage(imageURL.fileUrl);
            } catch (error) {
                message.error('Tải hình ảnh lên không thành công!');
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
            ellipsis: true,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={handleAdd}>
                    Add Banner
                </Button>
            </Space>
            <Table columns={columns} dataSource={bannerList} onChange={handleChange} rowKey="id" />
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
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please input the content!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            onRemove={() => setBackgroundImage(null)}
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
