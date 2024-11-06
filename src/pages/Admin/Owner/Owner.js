import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import Heading from '~/components/Common/Heading';
import Loading from '~/components/Common/Loading';
import * as ownerServices from '~/services/ownerServices';

import styles from './Owner.module.scss';

const cx = classNames.bind(styles);

const { Content } = Layout;

function Owner() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [ownerList, setOwnerList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentOwner, setCurrentOwner] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true)
        const res = await ownerServices.getOwner();
        if (res) {
            setOwnerList(res);
        }

        setLoading(false)
    };

    const handleAdd = () => {
        setCurrentOwner(null);
        form.resetFields();

        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentOwner(record);
        form.setFieldsValue(record);

        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await ownerServices.deleteOwner(id);
        message.success('Owner deleted successfully');
        fetchBanners();
    };

    const handleSave = async () => {
        const values = form.getFieldsValue();

        if (currentOwner) {
            await ownerServices.updateOwner(currentOwner.id, values);
            message.success('Owner updated successfully');
        } else {
            await ownerServices.addOwner(values);
            message.success('Owner added successfully');
        }
        setIsModalVisible(false);
        fetchBanners();
    };

    const handleChange = (_, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: 'Gmail',
            dataIndex: 'gmail',
            key: 'gmail',
            filteredValue: filteredInfo.gmail || null,
            onFilter: (value, record) => record.gmail.includes(value),
            sorter: (a, b) => a.gmail.length - b.gmail.length,
            sortOrder: sortedInfo.columnKey === 'gmail' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            filteredValue: filteredInfo.phone || null,
            onFilter: (value, record) => record.phone.includes(value),
            sorter: (a, b) => a.phone.length - b.phone.length,
            sortOrder: sortedInfo.columnKey === 'phone' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />}>
                    </Button>
                    <Button type="link" onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />}>
                    </Button>
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
                <Heading h2>Management Owner</Heading>
                <Button type="primary" onClick={handleAdd}>
                    Add Owner
                </Button>
            </Space>
            <Table
                expandable={{
                    expandedRowRender: (record) => <p>{record?.introduction}</p>,
                }}
                columns={columns}
                dataSource={ownerList}
                onChange={handleChange}
                rowKey="id"
            />
            <Modal
                title={currentOwner ? 'Edit Owner' : 'Add Owner'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="gmail"
                        label="Gmail"
                        rules={[{ required: true, message: 'Please input the gmail!' }]}
                    >
                        <Input placeholder="Enter the gmail" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please input the phone!' }]}
                    >
                        <Input placeholder="Enter the phone" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please input the address!' }]}
                    >
                        <Input placeholder="Enter the address" />
                    </Form.Item>

                    <Form.Item
                        name="introduction"
                        label="Introduction"
                        rules={[{ required: true, message: 'Please enter the introduction' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter a introduction" />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Owner;
