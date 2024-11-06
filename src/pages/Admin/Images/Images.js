import React, { useRef, useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Space, Table, Layout, Button, message, Input } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Heading from '~/components/Common/Heading';
import Loading from '~/components/Common/Loading';
import * as uploadImageServices from '~/services/uploadImage';

const { Content } = Layout;

function Images() {
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true)
        const res = await uploadImageServices.getImages();
        if (res) {
            const resNew = res.map((imageName, index) => ({
                key: index,
                imageName: imageName,
            }));
            setImageList(resNew);
            setLoading(false)
        }
    };

    const handleDelete = async (nameImage) => {
        await uploadImageServices.deleteImage(nameImage);
        message.success('Image deleted successfully');
        fetchImages();
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: ' Image Name',
            dataIndex: 'imageName',
            key: 'imageName',
            ...getColumnSearchProps('imageName'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleDelete(record.imageName)} icon={<DeleteOutlined />}>
                        Delete
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
            <Space
                style={{
                    marginBottom: 16,
                }}
            >
                <Heading h2>Management Images</Heading>
            </Space>
            <Table columns={columns} dataSource={imageList} rowKey="key" />
        </Content>
    );
}

export default Images;
