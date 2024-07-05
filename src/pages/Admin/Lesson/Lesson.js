import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Tooltip, Select } from 'antd';
import classNames from 'classnames/bind';
import * as lessonServices from '~/services/lessonServices';
import * as topicServices from '~/services/topicServices';
// import * as videoServices from '~/services/videoServices';
import styles from './Lesson.module.scss';

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

    useEffect(() => {
        fetchLessonsAndTopics();
    }, []);

    const fetchLessonsAndTopics = async () => {
        try {
            const [lessonRes, topicRes] = await Promise.all([lessonServices.getLesson(), topicServices.getTopic()]);
            if (lessonRes && topicRes) {
                const mergedLessons = lessonRes.map((lesson) => {
                    const topic = topicRes.find((topic) => topic.topicId === lesson.topicId);
                    return { ...lesson, topicName: topic ? topic.topicName : '' };
                });
                setState((prevState) => ({ ...prevState, lessonList: mergedLessons, topicList: topicRes }));
            }
        } catch (error) {
            console.error('Failed to fetch lessons and topics:', error);
        }
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
            console.error('Failed to delete lesson:', error);
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
            console.error('Failed to save lesson:', error);
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
        // try {
        //     await videoServices.deleteVideo(videoId);
        //     message.success('Video deleted successfully');
        //     fetchVideos(state.currentLesson);
        // } catch (error) {
        //     console.error('Failed to delete video:', error);
        //     message.error('Failed to delete video');
        // }
    };

    const handleSaveVideo = async () => {
        // try {
        //     const values = videoForm.getFieldsValue();
        //     if (state.currentVideo) {
        //         await videoServices.updateVideo(state.currentVideo.videoId, values);
        //         message.success('Video updated successfully');
        //     } else {
        //         await videoServices.addVideo({ ...values, lessonId: state.currentLesson });
        //         message.success('Video added successfully');
        //     }
        //     setState((prevState) => ({ ...prevState, isVideoModalVisible: false }));
        //     fetchVideos(state.currentLesson);
        // } catch (error) {
        //     console.error('Failed to save video:', error);
        //     message.error('Failed to save video');
        // }
    };

    const handleChange = (pagination, filters, sorter) => {
        setState((prevState) => ({
            ...prevState,
            filteredInfo: filters,
            sortedInfo: sorter,
        }));
    };

    const fetchVideos = async (lessonId) => {
        // try {
        //     const videoRes = await videoServices.getVideosByLessonId(lessonId);
        //     if (videoRes) {
        //         setState((prevState) => ({ ...prevState, videoList: videoRes }));
        //     }
        // } catch (error) {
        //     console.error('Failed to fetch videos:', error);
        // }
    };

    const expandedRowRender = (lesson) => {
        const columns = [
            { title: 'Title', dataIndex: 'videoTitle', key: 'videoTitle', ellipsis: true },
            { title: 'Link Video', dataIndex: 'path', key: 'path', ellipsis: true },
            { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
            {
                title: 'Action',
                key: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <Button type="link" onClick={() => handleEditVideo(record)}>
                            Edit
                        </Button>
                        <Button type="link" onClick={() => handleDeleteVideo(record.videoId)}>
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
                    <Button type="primary" onClick={() => handleAddVideo(lesson.lessonId)}>
                        Add Video
                    </Button>
                </Space>
                <Table
                    columns={columns}
                    dataSource={state.videoList.filter((video) => video.lessonId === lesson.lessonId)}
                    pagination={true}
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
                    <Button type="link" onClick={() => handleEditLesson(record)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => handleDeleteLesson(record.lessonId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
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
                        name="description"
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
