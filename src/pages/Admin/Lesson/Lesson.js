import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Tooltip, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import * as lessonServices from '~/services/lessonServices';
import * as topicServices from '~/services/topicServices';
import * as videoServices from '~/services/videoServices';
import styles from './Lesson.module.scss';
import Heading from '~/components/Common/Heading';
import Loading from '~/components/Common/Loading';

const cx = classNames.bind(styles);
const { Content } = Layout;

function Lesson() {
    const [state, setState] = useState({
        filteredInfo: {},
        sortedInfo: {},
        lessonList: [],
        topicList: [],
        isLessonModalVisible: false,
        isVideoModalVisible: false,
        currentLesson: null,
        currentVideo: null,
        videoList: [],
    });
    const [form] = Form.useForm();
    const [videoForm] = Form.useForm();
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        fetchLessonsAndTopics();
        fetchVideos();
    }, []);

    const fetchLessonsAndTopics = async () => {
        try {
            setLoading(true);
            const [lessonRes, topicRes] = await Promise.all([lessonServices.getLesson(), topicServices.getTopic()]);
            if (lessonRes && topicRes) {
                const mergedLessons = lessonRes.map((lesson) => {
                    const topic = topicRes.find((topic) => topic.topicId === lesson.topicId);
                    return { ...lesson, topicName: topic ? topic.topicName : '' };
                });
                setState((prevState) => ({ ...prevState, lessonList: mergedLessons, topicList: topicRes }));
            }
        } catch (error) {}
        finally {
            setLoading(false);
        }
    };

    const fetchVideos = async () => {
        try {
            const videoRes = await videoServices.getVideo();
            if (videoRes) {
                setState((prevState) => ({ ...prevState, videoList: videoRes }));
            }
        } catch (error) {}
    };

    const handleAddLesson = () => {
        form.resetFields();
        setState((prevState) => ({ ...prevState, currentLesson: null, isLessonModalVisible: true }));
    };

    const handleEditLesson = (record) => {
        setState((prevState) => ({ ...prevState, currentLesson: record, isLessonModalVisible: true }));
        form.setFieldsValue(record);
    };

    const handleDeleteLesson = async (id) => {
        try {
            await lessonServices.deleteLesson(id);
            message.success('Lesson deleted successfully');
            fetchLessonsAndTopics();
        } catch (error) {
            message.error('Failed to delete lesson');
        }
    };

    const handleSaveLesson = async () => {
        try {
            const values = form.getFieldsValue();
            if (state.currentLesson) {
                await lessonServices.updateLesson(state.currentLesson.lessonId, values);
                message.success('Lesson updated successfully');
            } else {
                await lessonServices.addLesson(values);
                message.success('Lesson added successfully');
            }
            setState((prevState) => ({ ...prevState, isLessonModalVisible: false }));
            fetchLessonsAndTopics();
        } catch (error) {
            message.error('Failed to save lesson');
        }
    };

    const handleAddVideo = (lessonId) => {
        videoForm.resetFields();
        setState((prevState) => ({
            ...prevState,
            currentLesson: lessonId,
            currentVideo: null,
            isVideoModalVisible: true,
        }));
    };

    const handleEditVideo = (record) => {
        setState((prevState) => ({ ...prevState, currentVideo: record, isVideoModalVisible: true }));
        videoForm.setFieldsValue(record);
    };

    const handleDeleteVideo = async (videoId) => {
        try {
            await videoServices.deleteVideo(videoId);
            message.success('Video deleted successfully');
            fetchVideos();
        } catch (error) {
            message.error('Failed to delete video');
        }
    };

    const handleSaveVideo = async () => {
        try {
            const values = videoForm.getFieldsValue();
            if (state.currentVideo) {
                await videoServices.updateVideo(state.currentVideo.videoId, values);
                message.success('Video updated successfully');
            } else {
                await videoServices.addVideo({ ...values, lessonId: state.currentLesson });
                message.success('Video added successfully');
            }
            setState((prevState) => ({ ...prevState, isVideoModalVisible: false }));
            fetchVideos();
        } catch (error) {
            message.error('Failed to save video');
        }
    };

    const handleChange = (_, filters, sorter) => {
        setState((prevState) => ({
            ...prevState,
            filteredInfo: filters,
            sortedInfo: sorter,
        }));
    };

    const expandedRowRender = (lesson) => {
        const columns = [
            {
                title: 'Title',
                dataIndex: 'videoTitle',
                key: 'videoTitle',
                ellipsis: true,
                onFilter: (value, record) => record.videoTitle.includes(value),
                sorter: (a, b) => (a.videoTitle || '').length - (b.videoTitle || '').length,
                sortOrder: state.sortedInfo.columnKey === 'videoTitle' ? state.sortedInfo.order : null,
            },
            { title: 'Link Video', dataIndex: 'path', key: 'path', ellipsis: true },
            {
                title: 'Description',
                dataIndex: 'description_V',
                key: 'description_V',
                ellipsis: true,
            },
            {
                title: 'Action',
                key: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <Tooltip title="Edit">
                            <EditOutlined type="link" style={{ color: 'blue' }} onClick={() => handleEditVideo(record)} />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteOutlined type="link" style={{ color: 'blue' }} onClick={() => handleDeleteVideo(record.videoId)} />
                        </Tooltip>
                    </Space>
                ),
                ellipsis: true,
            },
        ];
        return (
            <>
                <Space className={cx('btn-add')}>
                    <Heading h2>Management Video</Heading>
                    {state.videoList.filter((video) => video.lessonId === lesson.lessonId).length >= 1 ? (
                        ''
                    ) : (
                        <Button type="primary" onClick={() => handleAddVideo(lesson.lessonId)}>
                            Add Video
                        </Button>
                    )}
                </Space>
                <Table
                    columns={columns}
                    dataSource={state.videoList.filter((video) => video.lessonId === lesson.lessonId)}
                    pagination={false}
                    bordered
                    scroll={{ y: 400 }}
                    rowKey="videoId"
                />
            </>
        );
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'lessonId',
            key: 'lessonId',
            ellipsis: { showTitle: false },
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
            ellipsis: true,
            onFilter: (value, record) => record.lessonName.includes(value),
            sorter: (a, b) => (a.lessonName || '').length - (b.lessonName || '').length,
            sortOrder: state.sortedInfo.columnKey === 'lessonName' ? state.sortedInfo.order : null,
        },
        {
            title: 'Topic',
            dataIndex: 'topicName',
            key: 'topicName',
            ellipsis: true,
            onFilter: (value, record) => record.topicName.includes(value),
            sorter: (a, b) => (a.topicName || '').length - (b.topicName || '').length,
            sortOrder: state.sortedInfo.columnKey === 'topicName' ? state.sortedInfo.order : null,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <EditOutlined type="link" style={{ color: 'blue' }} onClick={() => handleEditLesson(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined type="link" style={{ color: 'blue' }} onClick={() => handleDeleteLesson(record.lessonId)} />
                    </Tooltip>
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
                <Heading h2>Management Lesson</Heading>
                <Button type="primary" onClick={handleAddLesson}>
                    Add Lesson
                </Button>
            </Space>
            <Table
                expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                columns={columns}
                dataSource={state.lessonList}
                onChange={handleChange}
                rowKey="lessonId"
            />
            <Modal
                title={state.currentLesson ? 'Edit Lesson' : 'Add Lesson'}
                open={state.isLessonModalVisible}
                onOk={handleSaveLesson}
                onCancel={() => setState((prevState) => ({ ...prevState, isLessonModalVisible: false }))}
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
                            {state.topicList.map((topic) => (
                                <Select.Option key={topic.topicId} value={topic.topicId}>
                                    {topic.topicName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={state.currentVideo ? 'Edit Video' : 'Add Video'}
                open={state.isVideoModalVisible}
                onOk={handleSaveVideo}
                onCancel={() => setState((prevState) => ({ ...prevState, isVideoModalVisible: false }))}
            >
                <Form form={videoForm} layout="vertical">
                    <Form.Item
                        name="videoTitle"
                        label="Video Title"
                        rules={[{ required: true, message: 'Please input the video title!' }]}
                    >
                        <Input placeholder="Enter the video title" />
                    </Form.Item>
                    <Form.Item
                        name="path"
                        label="Video Link"
                        rules={[{ required: true, message: 'Please input the video link!' }]}
                    >
                        <Input placeholder="Enter the video link" />
                    </Form.Item>
                    <Form.Item
                        name="description_V"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input placeholder="Enter the description" />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Lesson;
