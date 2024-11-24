import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    IconDashboard,
    IconUsers,
    IconBook,
    IconBook2,
    IconWriting,
    IconPhotoSearch,
    IconSteam,
    IconPhotoScan,
    IconFlask2,
} from '@tabler/icons-react';
import config from '~/config';

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

function MenuAdmin() {
    const items = [
        getItem(<Link to={config.routes.admin}>Trang chủ</Link>, '1', <IconDashboard stroke={1} fontSize={18} />),
        getItem('Quản lý bài học', '2', <IconDashboard stroke={1} fontSize={18} />, [
            getItem(<Link to={config.routes.stem}>STEM</Link>, '3', <IconSteam stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.topicAdmin}>Topic</Link>, '4', <IconBook stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.lesson}>Lesson</Link>, '5', <IconBook2 stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.banner}>Banner</Link>, '6', <IconPhotoScan stroke={1} fontSize={18} />),
            getItem(
                <Link to={config.routes.scientistAdmin}>Scientist</Link>,
                '7',
                <IconFlask2 stroke={1} fontSize={18} />,
            ),
            getItem(<Link to={config.routes.images}>Images</Link>, '8', <IconPhotoSearch stroke={1} fontSize={18} />),
        ]),
        getItem(
            <Link to={config.routes.postsAdmin}>Quản lí bài viết</Link>,
            '9',
            <IconWriting stroke={1} fontSize={18} />,
        ),
        getItem(
            <Link to={config.routes.account}>Quản lí tài khoản</Link>,
            '10',
            <IconUsers stroke={1} fontSize={18} />,
        ),
    ];

    return <Menu theme="dark" mode="inline" items={items} />;
}

export default MenuAdmin;
