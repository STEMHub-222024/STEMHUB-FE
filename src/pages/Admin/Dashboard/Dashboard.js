import React, { useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';
import { Layout, Card, Row, Col, Spin, message, Space } from 'antd';
import { Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import Heading from '~/components/Common/Heading';
import * as userServices from '~/services/userServices';
import * as topicServices from '~/services/topicServices';
import * as lessonServices from '~/services/lessonServices';
import * as commentServices from '~/services/commentServices';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

const { Content } = Layout;

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await userServices.getUseAll();
                setUsers(userResponse);

                const topicResponse = await topicServices.getTopic();
                setTopics(topicResponse);

                const lessonResponse = await lessonServices.getLesson();
                setLessons(lessonResponse);

                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (lessons.length > 0) {
            fetchLessonInteractions();
        }
    }, [lessons]);

    const fetchLessonInteractions = async () => {
        try {
            const lessonIds = lessons.map((lesson) => lesson.lessonId);
            const commentCounts = await Promise.all(
                lessonIds.map((lessonId) => {
                    return commentServices.getCommentIdLesson({ newLessonId: lessonId });
                }),
            );

            const updatedLessons = lessons.map((lesson, index) => ({
                ...lesson,
                comments: commentCounts[index],
            }));

            setLessons(updatedLessons);
        } catch (error) {
            if (error?.response?.status === 404) {
                return;
            }
            message.error('Failed to fetch lesson interactions');
        }
    };

    const userRegistrationData = users.reduce((acc, user) => {
        const date = moment(user.registrationDate).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});

    const userChartData = Object.entries(userRegistrationData).map(([date, count]) => ({
        date,
        count,
    }));

    const topicChartData = topics.map((topic) => ({
        name: topic.topicName,
        views: topic.view,
    }));

    const lessonInteractionChartData = lessons.map((lesson) => ({
        name: lesson.lessonName,
        comments: lesson.comments || 0,
    }));

    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 500,
            }}
        >
            <Space
                style={{
                    marginBottom: 16,
                }}
            >
                <Heading h2>Dashboard</Heading>
            </Space>
            {loading ? (
                <div className={cx('wrapper-loading')}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="User Registrations Over Time">
                                <LineChart width={800} height={300} data={userChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                </LineChart>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="Topics">
                                <BarChart width={800} height={300} data={topicChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#82ca9d" />
                                </BarChart>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="Lesson Interactions">
                                <BarChart width={800} height={300} data={lessonInteractionChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="comments" fill="#8884d8" />
                                </BarChart>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Content>
    );
};

export default Dashboard;
