import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Tooltip, Select } from 'antd';
import * as lessonServices from '~/services/lessonServices';
import * as topicServices from '~/services/topicServices';

import styles from './Lesson.module.scss';

const cx = classNames.bind(styles);
const { Content } = Layout;

function Lesson() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [lessonList, setLessonList] = useState([]);
    const [topicList, setTopicList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLessons();
        fetchTopics();
    }, []);

    const fetchLessons = async () => {
        const lessonRes = await lessonServices.getLesson();
        const topicRes = await topicServices.getTopic();
        if (lessonRes && topicRes) {
            const mergedLessons = lessonRes.map((lesson) => {
                const topic = topicRes.find((topic) => topic.topicId === lesson.topicId);
                return { ...lesson, topicName: topic ? topic.topicName : '' };
            });
            setLessonList(mergedLessons);
            setTopicList(topicRes);
        }
    };

    const fetchTopics = async () => {
        const res = await topicServices.getTopic();
        if (res) {
            setTopicList(res);
        }
    };

    const handleAdd = () => {
        form.resetFields();
        setCurrentLesson(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentLesson(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await lessonServices.deleteLesson(id);
        message.success('Lesson deleted successfully');
        fetchLessons();
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        if (currentLesson) {
            await lessonServices.updateLesson(currentLesson.lessonId, values);
            message.success('Lesson updated successfully');
        } else {
            await lessonServices.addLesson(values);
            message.success('Lesson added successfully');
        }
        setIsModalVisible(false);
        fetchLessons();
    };

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'lessonId',
            key: 'lessonId',
            ellipsis: {
                showTitle: false,
            },
            render: (lessonId) => (
                <Tooltip placement="topLeft" title={lessonId}>
                    {lessonId}
                </Tooltip>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'lessonName',
            key: 'lessonName',
            filteredValue: filteredInfo.lessonName || null,
            onFilter: (value, record) => record.lessonName.includes(value),
            sorter: (a, b) => (a.lessonName || '').length - (b.lessonName || '').length,
            sortOrder: sortedInfo.columnKey === 'lessonName' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Topic',
            dataIndex: 'topicName',
            key: 'topicName',
            filteredValue: filteredInfo.topicName || null,
            onFilter: (value, record) => record.topicName.includes(value),
            sorter: (a, b) => (a.topicName || '').length - (b.topicName || '').length,
            sortOrder: sortedInfo.columnKey === 'topicName' ? sortedInfo.order : null,
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
                    <Button type="link" onClick={() => handleDelete(record.lessonId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Button type="primary" onClick={handleAdd}>
                    Add Lesson
                </Button>
            </Space>
            <Table columns={columns} dataSource={lessonList} onChange={handleChange} rowKey="lessonId" />
            <Modal
                title={currentLesson ? 'Edit Lesson' : 'Add Lesson'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="lessonName"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the Name!' }]}
                    >
                        <Input placeholder="Enter a lesson name" />
                    </Form.Item>
                    <Form.Item
                        name="topicId"
                        label="Topic"
                        rules={[{ required: true, message: 'Please select a topic!' }]}
                    >
                        <Select placeholder="Select a topic">
                            {topicList.map((topic) => (
                                <Select.Option key={topic.topicId} value={topic.topicId}>
                                    {topic.topicName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Lesson;
