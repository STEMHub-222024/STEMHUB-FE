import classNames from 'classnames/bind';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Space, Table, Layout, Button, Modal, Form, Input, Select, notification } from 'antd';
import Heading from '~/components/Common/Heading';
import { USER, ADMIN } from '~/utils/constant';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import styles from './Account.module.scss';

const { Content } = Layout;
const { Option } = Select;
const cx = classNames.bind(styles);

function Account() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [userList, setUserList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchApi = useCallback(async () => {
        const res = await userServices.getUseAll();
        if (res) {
            const resNew = res.map((user, index) => ({
                key: index,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            }));
            setUserList(resNew);
        }
    }, []);

    useEffect(() => {
        fetchApi();
    }, [fetchApi]);

    const handleChange = (_, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = useMemo(
        () => [
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
                filteredValue: filteredInfo.lastName || null,
                onFilter: (value, record) => record.lastName.includes(value),
                sorter: (a, b) => a.lastName.length - b.lastName.length,
                sortOrder: sortedInfo.columnKey === 'lastName' ? sortedInfo.order : null,
                ellipsis: true,
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
                filteredValue: filteredInfo.firstName || null,
                onFilter: (value, record) => record.firstName.includes(value),
                sorter: (a, b) => a.firstName.length - b.firstName.length,
                sortOrder: sortedInfo.columnKey === 'firstName' ? sortedInfo.order : null,
                ellipsis: true,
            },
            {
                title: 'User Name',
                dataIndex: 'userName',
                key: 'userName',
                filteredValue: filteredInfo.userName || null,
                onFilter: (value, record) => record.userName.includes(value),
                sorter: (a, b) => a.userName.length - b.userName.length,
                sortOrder: sortedInfo.columnKey === 'userName' ? sortedInfo.order : null,
                ellipsis: true,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                filteredValue: filteredInfo.email || null,
                onFilter: (value, record) => record.email.includes(value),
                sorter: (a, b) => a.email.length - b.email.length,
                sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
                ellipsis: true,
            },
            {
                title: 'Phone',
                dataIndex: 'phoneNumber',
                key: 'phoneNumber',
                filters: [
                    {
                        text: 'Viettel',
                        value: '03',
                    },
                    {
                        text: 'Vina',
                        value: '08',
                    },
                    {
                        text: 'Mobile',
                        value: '07',
                    },
                ],
                filteredValue: filteredInfo.phoneNumber || null,
                onFilter: (value, record) => record.phoneNumber?.startsWith(value),
                sorter: (a, b) => (a.phoneNumber || '').length - (b.phoneNumber || '').length,
                sortOrder: sortedInfo.columnKey === 'phoneNumber' ? sortedInfo.order : null,
                ellipsis: true,
            },
        ],
        [filteredInfo, sortedInfo],
    );

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const newUser = await authServices.postAuthUser({
                        lastName: values.lastName,
                        firstName: values.firstName,
                        username: values.userName,
                        email: values.email,
                        phoneNumber: values.phoneNumber,
                        password: values.password,
                        roles: values.role,
                    });
                    setUserList((prevUserList) => [...prevUserList, { ...newUser, key: prevUserList.length }]);
                    setIsModalVisible(false);
                    form.resetFields();
                    notification.success({
                        message: 'User added successfully',
                    });
                } catch (_) {
                    notification.error({
                        message: 'Failed to add user',
                    });
                }
            })
            .catch((info) => {});
    };

    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 525,
            }}
        >
            <>
                <Space
                    style={{
                        marginBottom: 16,
                    }}
                    className={cx('btn-add')}
                >
                    <Heading h2>Management Account</Heading>
                    <Button type="primary" onClick={showModal}>
                        Add User
                    </Button>
                </Space>
                <Table columns={columns} dataSource={userList} onChange={handleChange} rowKey="key" />
            </>
            <Modal title="Add New User" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the last name!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter the last name" />
                    </Form.Item>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the first name!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter the first name" />
                    </Form.Item>
                    <Form.Item
                        name="userName"
                        label="User Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the user name!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter the user name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the email!',
                            },
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter the email" />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the phone number!',
                            },
                        ]}
                    >
                        <Input placeholder="Enter the phone number" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter the password" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a role!',
                            },
                        ]}
                    >
                        <Select placeholder="Select a role">
                            <Option value={USER}>User</Option>
                            <Option value={ADMIN}>Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
}

export default Account;
