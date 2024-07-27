import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';
import { Layout, Card, Row, Col, Spin, message, Space } from 'antd';
import Heading from '~/components/Common/Heading';
import UserChart from './UserChart';
import TopicChart from './TopicChart';
import LessonInteractionChart from './LessonInteractionChart';
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

    const fetchData = useCallback(async () => {
        try {
            const lessonResponse = await lessonServices.getLesson();
            setLessons(lessonResponse);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch data');
            setLoading(false);
        }
    }, []);

    const fetchUsersAndTopics = useCallback(async () => {
        try {
            const [userResponse, topicResponse] = await Promise.all([
                userServices.getUseAll(),
                topicServices.getTopic(),
            ]);
            setUsers(userResponse);
            setTopics(topicResponse);
        } catch (error) {
            message.error('Failed to fetch users and topics');
        }
    }, []);

    const fetchLessonInteractions = useCallback(async () => {
        try {
            const lessonIds = lessons.map((lesson) => lesson.lessonId);

            const commentCounts = await Promise.allSettled(
                lessonIds.map((lessonId) =>
                    commentServices
                        .getCommentIdLesson({ newLessonId: lessonId })
                        .then((response) => response.length)
                        .catch((error) => (error?.response?.status === 404 ? 0 : Promise.reject(error))),
                ),
            );
            const updatedLessons = lessons.map((lesson, index) => ({
                ...lesson,
                comments: commentCounts[index].status === 'fulfilled' ? commentCounts[index].value : 0,
            }));

            setLessons(updatedLessons);
        } catch (error) {
            message.error('Failed to fetch lesson interactions');
        }
    }, [lessons]);

    useEffect(() => {
        if (lessons.length === 0) {
            fetchData();
        }
    }, [lessons, fetchData]);

    useEffect(() => {
        fetchUsersAndTopics();
    }, [fetchUsersAndTopics]);

    useEffect(() => {
        if (lessons.length > 0 && lessons.some((lesson) => lesson.comments === undefined)) {
            fetchLessonInteractions();
        }
    }, [lessons, fetchLessonInteractions]);

    const userChartData = useMemo(() => {
        const userRegistrationData = users.reduce((acc, user) => {
            const date = moment(user.registrationDate).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        return Object.entries(userRegistrationData).map(([date, count]) => ({
            date,
            count,
        }));
    }, [users]);

    const topicChartData = useMemo(
        () =>
            topics.map((topic) => ({
                name: topic.topicName,
                views: topic.view,
            })),
        [topics],
    );

    const lessonInteractionChartData = useMemo(
        () =>
            lessons.map((lesson) => ({
                name: lesson.lessonName,
                comments: typeof lesson.comments === 'number' ? lesson.comments : 0,
            })),
        [lessons],
    );

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
                <Suspense fallback={<Spin size="large" />}>
                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="User Registrations Over Time">
                                <UserChart data={userChartData} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="Topics">
                                <TopicChart data={topicChartData} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} className={cx('colum')}>
                            <Card title="Lesson Interactions">
                                <LessonInteractionChart data={lessonInteractionChartData} />
                            </Card>
                        </Col>
                    </Row>
                </Suspense>
            )}
        </Content>
    );
};

export default Dashboard;
