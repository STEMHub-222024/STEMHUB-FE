import React, { useEffect, useState } from 'react';
import { Space, Table, Layout } from 'antd';

import * as userServices from '~/services/userServices';

const { Content } = Layout;

function Learner() {
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getUseAll();
            if (res) {
                const resNew = res.map((user) => {
                    return {
                        userName: user.userName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                    };
                });
                setUserList(resNew);
            }
        };
        fetchApi();
    }, []);

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
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
            // filteredValue: filteredInfo.phoneNumber || null,
            // onFilter: (value, record) => record.phoneNumber.includes(value),
            // sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
            // sortOrder: sortedInfo.columnKey === 'phoneNumber' ? sortedInfo.order : null,
            ellipsis: true,
        },
    ];
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
                ></Space>
                <Table columns={columns} dataSource={userList} onChange={handleChange} />
            </>
        </Content>
    );
}

export default Learner;
