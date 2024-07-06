import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Upload, Select, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postImage, deleteImage } from '~/services/uploadImage';
import * as topicServices from '~/services/topicServices';
import * as stemServices from '~/services/stemServices';
import * as ingredientServices from '~/services/ingredientServices';

import styles from './Topic.module.scss';
import Heading from '~/components/Common/Heading';

const cx = classNames.bind(styles);
const { Content } = Layout;
const { Option } = Select;

function Topic() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [topicList, setTopicList] = useState([]);
    const [stemList, setStemList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isIngredientModalVisible, setIsIngredientModalVisible] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [form] = Form.useForm();
    const [ingredientForm] = Form.useForm();

    useEffect(() => {
        fetchTopics();
        fetchStems();
    }, []);

    const fetchTopics = async () => {
        const topicRes = await topicServices.getTopic();
        const stemRes = await stemServices.getStem();
        if (topicRes && stemRes) {
            const mergedTopics = topicRes.map((topic) => {
                const stem = stemRes.find((stem) => stem.stemId === topic.stemId);
                return { ...topic, stemName: stem ? stem.stemName : '' };
            });
            setTopicList(mergedTopics);
        }
    };

    const fetchStems = async () => {
        const res = await stemServices.getStem();
        if (res) {
            setStemList(res);
        }
    };

    const fetchIngredients = async () => {
        const ingredientRes = await ingredientServices.getIngredientsByTopic();
        if (ingredientRes) {
            setIngredientList(ingredientRes);
        }
    };

    const handleAdd = () => {
        setCurrentTopic(null);
        form.resetFields();
        setBackgroundImage(null);
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentTopic(record);
        form.setFieldsValue(record);
        setBackgroundImage(record.topicImage);
        setFileList([
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: record.topicImage,
            },
        ]);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await topicServices.deleteTopic(id);
        message.success('Topic deleted successfully');
        fetchTopics();
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        values.topicImage = backgroundImage;
        if (currentTopic) {
            await topicServices.updateTopic(currentTopic.topicId, values);
            message.success('Topic updated successfully');
        } else {
            await topicServices.addTopic(values);
            message.success('Topic added successfully');
        }
        setIsModalVisible(false);
        fetchTopics();
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

    const handleIngredientAdd = async (topicId) => {
        await fetchIngredients();
        setCurrentIngredient(null);
        ingredientForm.resetFields();
        setCurrentTopic({ topicId });
        setIsIngredientModalVisible(true);
    };

    const handleIngredientEdit = (record) => {
        setCurrentIngredient(record);
        ingredientForm.setFieldsValue(record);
        setIsIngredientModalVisible(true);
    };

    const handleIngredientDelete = async (id) => {
        if (currentTopic && currentTopic.topicId) {
            await ingredientServices.deleteIngredient(id);
            message.success('Ingredient deleted successfully');
            fetchIngredients();
        }
    };

    const handleIngredientSave = async () => {
        const values = ingredientForm.getFieldsValue();
        if (currentTopic && currentTopic.topicId) {
            values.topicId = currentTopic.topicId;
            if (currentIngredient) {
                await ingredientServices.updateIngredient(currentIngredient.ingredientsId, values);
                message.success('Ingredient updated successfully');
            } else {
                await ingredientServices.addIngredient(values);
                message.success('Ingredient added successfully');
            }
            setIsIngredientModalVisible(false);
            fetchIngredients();
        }
    };

    const handleChange = (_, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const handleExpand = async (expanded, record) => {
        if (expanded) {
            await fetchIngredients();
            setCurrentTopic(record);
        }
    };

    const expandedRowRender = (topic) => {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'ingredientsName',
                key: 'ingredientsName',
                ellipsis: true,
            },
            {
                title: 'Action',
                key: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <Button type="link" onClick={() => handleIngredientEdit(record)}>
                            Edit
                        </Button>
                        <Button type="link" onClick={() => handleIngredientDelete(record.ingredientsId)}>
                            Delete
                        </Button>
                    </Space>
                ),
                ellipsis: true,
            },
        ];
        return (
            <>
                <Space className={cx('btn-add')}>
                    <Heading h2>Management Ingredient</Heading>
                    <Button type="primary" onClick={() => handleIngredientAdd(topic.topicId)}>
                        Add Ingredient
                    </Button>
                </Space>
                <Table
                    columns={columns}
                    dataSource={ingredientList.filter((ingredient) => ingredient.topicId === topic.topicId)}
                    pagination={false}
                    bordered
                    scroll={{ y: 400 }}
                    rowKey="ingredientsId"
                />
            </>
        );
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'topicId',
            key: 'topicId',
            ellipsis: {
                showTitle: false,
            },
            render: (topicId) => (
                <Tooltip placement="topLeft" title={topicId}>
                    {topicId}
                </Tooltip>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'topicName',
            key: 'topicName',
            filteredValue: filteredInfo.topicName || null,
            onFilter: (value, record) => record.topicName.includes(value),
            sorter: (a, b) => (a.topicName || '').length - (b.topicName || '').length,
            sortOrder: sortedInfo.columnKey === 'topicName' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Video Review',
            dataIndex: 'videoReview',
            key: 'videoReview',
            ellipsis: true,
        },
        {
            title: 'Image',
            dataIndex: 'topicImage',
            key: 'topicImage',
            ellipsis: true,
        },
        {
            title: 'Stem',
            dataIndex: 'stemName',
            key: 'stemName',
            filteredValue: filteredInfo.stemName || null,
            onFilter: (value, record) => record.stemName.includes(value),
            sorter: (a, b) => (a.stemName || '').length - (b.stemName || '').length,
            sortOrder: sortedInfo.columnKey === 'stemName' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description}>
                    {description}
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
                    <Button type="link" onClick={() => handleDelete(record.topicId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];
    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Topic</Heading>
                <Button type="primary" onClick={handleAdd}>
                    Add Topic
                </Button>
            </Space>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.topicId,
                    onExpand: handleExpand,
                }}
                dataSource={topicList}
                onChange={handleChange}
                rowKey="topicId"
            />
            <Modal
                title={currentTopic ? 'Edit Topic' : 'Add Topic'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="topicName"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the topic name!' }]}
                    >
                        <Input placeholder="Enter a topic name" />
                    </Form.Item>
                    <Form.Item
                        name="videoReview"
                        label="Video Review"
                        rules={[{ required: true, message: 'Please input the video review link!' }]}
                    >
                        <Input placeholder="Add video review link" />
                    </Form.Item>
                    <Form.Item
                        name="topicImage"
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
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input placeholder="Enter a topic description" />
                    </Form.Item>
                    <Form.Item
                        name="stemId"
                        label="Stem"
                        rules={[{ required: true, message: 'Please select a stem!' }]}
                    >
                        <Select placeholder="Select a stem">
                            {stemList.map((stem) => (
                                <Option key={stem.stemId} value={stem.stemId}>
                                    {stem.stemName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={currentIngredient ? 'Edit Ingredient' : 'Add Ingredient'}
                open={isIngredientModalVisible}
                onOk={handleIngredientSave}
                onCancel={() => setIsIngredientModalVisible(false)}
            >
                <Form form={ingredientForm} layout="vertical">
                    <Form.Item
                        name="ingredientsName"
                        label="Ingredient Name"
                        rules={[{ required: true, message: 'Please input the ingredient name!' }]}
                    >
                        <Input placeholder="Enter an ingredient name" />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Topic;
