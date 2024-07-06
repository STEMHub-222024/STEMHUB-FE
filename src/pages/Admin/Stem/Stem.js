import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import Heading from '~/components/Common/Heading';
import * as stemServices from '~/services/stemServices';

import styles from './Stem.module.scss';

const cx = classNames.bind(styles);
const { Content } = Layout;

function Stem() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [steamList, setStemList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentStem, setCurrentStem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchStems();
    }, []);

    const fetchStems = async () => {
        const res = await stemServices.getStem();
        if (res) {
            const resNew = res.map((stem, index) => ({
                key: index,
                ...stem,
            }));
            setStemList(resNew);
        }
    };

    const handleAdd = () => {
        form.resetFields();
        setCurrentStem(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentStem(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await stemServices.deleteStem(id);
        message.success('Stem deleted successfully');
        fetchStems();
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();
        if (currentStem) {
            await stemServices.updateStem(currentStem.stemId, values);
            message.success('Stem updated successfully');
        } else {
            await stemServices.addStem(values);
            message.success('Stem added successfully');
        }
        setIsModalVisible(false);
        fetchStems();
    };

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'stemId',
            key: 'stemId',
            ellipsis: {
                showTitle: false,
            },
            render: (stemId) => (
                <Tooltip placement="topLeft" title={stemId}>
                    {stemId}
                </Tooltip>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'stemName',
            key: 'stemName',
            filteredValue: filteredInfo.stemName || null,
            onFilter: (value, record) => record.stemName.includes(value),
            sorter: (a, b) => (a.stemName || '').length - (b.stemName || '').length,
            sortOrder: sortedInfo.columnKey === 'stemName' ? sortedInfo.order : null,
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
                    <Button type="link" onClick={() => handleDelete(record.stemId)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 525 }}>
            <Space className={cx('btn-add')}>
                <Heading h2>Management Stem</Heading>
                <Button type="primary" onClick={handleAdd}>
                    Add Stem
                </Button>
            </Space>
            <Table columns={columns} dataSource={steamList} onChange={handleChange} rowKey="stemId" />
            <Modal
                title={currentStem ? 'Edit Stem' : 'Add Stem'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="stemName"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the Name!' }]}
                    >
                        <Input placeholder="Enter the Name" />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Stem;
