import classNames from 'classnames/bind';
import React, { useRef, useEffect, useState } from 'react';
import Heading from '~/components/Common/Heading';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Table, Layout, Button, message, Form, Modal, Row, Col, Select } from 'antd';
import * as partServices from '~/services/partServices';
import * as lessonServices from '~/services/lessonServices';
import Loading from '~/components/Common/Loading';
import styles from './Parts.module.scss';
import TextEditorPart from './EditTextPart';

const { Content } = Layout;

const cx = classNames.bind(styles);

function Parts() {
    const textEditorRefMaterial = useRef();
    const textEditorRefSteps = useRef();
    const textEditorRefResult = useRef();

    const [state, setState] = useState({
        resParts: [],
        lessonList: [],
        lessonFull: [],
        isLessonModalVisible: false,
        editingPart: null,
    });
    
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true); 
    const [materialMarkdown, setMaterialMarkdown] = useState('');
    const [materialHtmlContent, setMaterialHtmlContent] = useState('');
    const [stepsMarkdown, setStepsMarkdown] = useState('');
    const [stepsHtmlContent, setStepsHtmlContent] = useState('');
    const [resultMarkdown, setResultMarkdown] = useState('');
    const [resultHtmlContent, setResultHtmlContent] = useState('');

    useEffect(() => {
        fetchLessonsAndParts();
    }, []);

    const fetchLessonsAndParts = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                lessonServices.getLesson(),
                partServices.getPart()
            ]);

            const resLessons = results[0].status === 'fulfilled' ? results[0].value : null;
            const resParts = results[1].status === 'fulfilled' ? results[1].value : null;

            if (resLessons) {
                console.log("vip nè", resLessons, resParts);
                if (resParts) {
                    const filteredLessons = resLessons.filter(lesson => 
                        !resParts.some(part => part.lessonId === lesson.lessonId)
                    );
                    setState((prevState) => ({ ...prevState, resParts: resParts, lessonList: filteredLessons, lessonFull: resLessons }));
                } else {
                    setState((prevState) => ({ ...prevState, resParts: [], lessonList: resLessons, lessonFull: resLessons }));
                }
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleClearEditors = () => {
        if (textEditorRefMaterial.current) {
            textEditorRefMaterial.current.clearEditorContent();
        }
        if (textEditorRefSteps.current) {
            textEditorRefSteps.current.clearEditorContent();
        }
        if (textEditorRefResult.current) {
            textEditorRefResult.current.clearEditorContent();
        }
    };

    const handleDelete = async (partId) => {
        await partServices.deletePart(partId);
        message.success('Part deleted successfully');
        fetchLessonsAndParts();
    };

    const handleSave = async (values) => {
        const hide = message.loading('Publishing...', 0);
        try {
            const partData = {
                materialsMarkdown: materialMarkdown,
                materialsHtmlContent: materialHtmlContent,
                stepsMarkdown: stepsMarkdown,
                stepsHtmlContent: stepsHtmlContent,
                resultsMarkdown: resultMarkdown,
                resultsHtmlContent: resultHtmlContent,
                ...values,
            };
            if (state.editingPart) {
                await partServices.updatePart(state.editingPart.partId, partData);
                hide();
                message.success('Part updated successfully');
            } else {
                await partServices.addPart(partData);
                hide();
                message.success('Part created successfully');
            }
            fetchLessonsAndParts();
            setState((prevState) => ({ ...prevState, isLessonModalVisible: false }));
            handleClearEditors();
        } catch (error) {
            hide();
            message.error('Error saving part');
        }
    };

    const handleAdd = () => { 
        form.resetFields();
        setState((prevState) => {
            console.log("duc vip pro", prevState);
           return ({ ...prevState, editingPart: null, isLessonModalVisible: true })
        });
        setMaterialMarkdown('');
        setMaterialHtmlContent('');
        setStepsMarkdown('');
        setStepsHtmlContent('');
        setResultMarkdown('');
        setResultHtmlContent('');
    };

    const handleEdit = (record) => {
        setState((prevState) => ({ ...prevState, lessonList: [...prevState.lessonFull.filter(lesson => lesson.lessonId === record.lessonId), ...prevState.lessonList], editingPart: record, isLessonModalVisible: true }));
        form.setFieldsValue(record);
        setMaterialMarkdown(record.materialsMarkdown);
        setMaterialHtmlContent(record.materialsHtmlContent);
        setStepsMarkdown(record.stepsMarkdown);
        setStepsHtmlContent(record.stepsHtmlContent); 
        setResultMarkdown(record.resultsMarkdown);
        setResultHtmlContent(record.resultsHtmlContent);
    };

    const columns = [
        {
            title: 'Preparation steps and results',
            key: 'Preparation steps and results',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
                    <Button type="link" onClick={() => handleDelete(record.partId)} icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    const handleClose = () => {
        fetchLessonsAndParts();
        setState((prevState) => ({ ...prevState, isLessonModalVisible: false }));
    }

    if (loading) {
        return <Loading title='Loading....' />;
    }

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Manage Parts</Heading>
                <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                    Add Part
                </Button>
            </Space>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ display: "flex", flexDirection: 'column', padding: '16px' }}>
                            <Row gutter={16}>
                                <Col span={24} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px', marginBottom: '16px' }}>
                                    <h4>Material</h4>
                                    <p dangerouslySetInnerHTML={{ __html: record.materialsHtmlContent ?? '' }}></p>
                                </Col>
                                <Col span={24} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px', marginBottom: '16px' }}>
                                    <h4>Steps</h4>
                                    <p dangerouslySetInnerHTML={{ __html: record.stepsHtmlContent ?? '' }}></p>
                                </Col>
                                <Col span={24} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px', marginBottom: '16px' }}>
                                    <h4>Result</h4>
                                    <p dangerouslySetInnerHTML={{ __html: record.resultsHtmlContent ?? '' }}></p>
                                </Col>
                            </Row>
                        </div>
                    ),
                }}
                dataSource={state.resParts}
                rowKey="partId"
            />

            <Modal
                title={state.editingPart ? 'Edit Part' : 'Add Part'}
                open={state.isLessonModalVisible}
                onCancel={handleClose}
                footer={null}
                width={1000}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSave}
                    form={form}
                >
                     <Form.Item
                        name="lessonId"
                        label="Lesson"
                        rules={[{ required: true, message: 'Please select a lesson!' }]}
                    >
                        <Select placeholder="Select a lesson">
                            {state.lessonList && state.lessonList.map((lesson) => (
                                <Select.Option key={lesson.lessonId} value={lesson.lessonId}>
                                    {lesson.lessonName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label={<strong style={{ borderBottom: '2px solid blue' }}>Material</strong>} style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
                        <div className={cx('text-editor')}>
                            <TextEditorPart
                                ref={textEditorRefMaterial}
                                className={cx('text-content')}
                                showHtml
                                placeholder="Write material content here"
                                initialContent={{ markdown: materialMarkdown, htmlContent: materialHtmlContent }}
                                setMarkdown={setMaterialMarkdown}
                                setHtmlContent={setMaterialHtmlContent}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item label={<strong style={{ borderBottom: '2px solid blue' }}>Steps</strong>} style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
                        <div className={cx('text-editor')}>
                            <TextEditorPart
                                ref={textEditorRefSteps}
                                className={cx('text-content')}
                                showHtml
                                placeholder="Write steps content here"
                                initialContent={{ markdown: stepsMarkdown, htmlContent: stepsHtmlContent }}
                                setMarkdown={setStepsMarkdown}
                                setHtmlContent={setStepsHtmlContent}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item label={<strong style={{ borderBottom: '2px solid blue' }}>Result</strong>} style={{ border: '1px solid #d9d9d9', padding: '8px' }}>
                        <div className={cx('text-editor')}>
                            <TextEditorPart
                                ref={textEditorRefResult}
                                className={cx('text-content')}
                                showHtml
                                placeholder="Write result content here"
                                initialContent={{ markdown: resultMarkdown, htmlContent: resultHtmlContent }}
                                setMarkdown={setResultMarkdown}
                                setHtmlContent={setResultHtmlContent}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={handleClose}>Cancel</Button>
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

export default Parts;