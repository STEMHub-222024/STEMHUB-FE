import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    IconDashboard,
    IconUsers,
    IconPhotoSearch,
    IconSteam,
    IconPhotoScan,
    IconFlask2,
    IconBook,
    IconBook2,
    IconWriting,
    IconTower,
    IconTools,
    IconSchool,
    IconStack2,
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
        getItem('Quản lý bài học', '2', <IconSchool stroke={1} fontSize={18} />, [
            getItem(<Link to={config.routes.stem}>STEM</Link>, '3', <IconSteam stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.topicAdmin}>Topic</Link>, '4', <IconBook stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.lesson}>Lesson</Link>, '5', <IconBook2 stroke={1} fontSize={18} />),
            getItem(
                <Link to={config.routes.scientistAdmin}>Scientist</Link>,
                '6',
                <IconFlask2 stroke={1} fontSize={18} />,
            ),
            getItem(<Link to={config.routes.parts}>Parts</Link>, '7', <IconTools stroke={1} fontSize={18} />),
        ]),
        getItem(
            <Link to={config.routes.postsAdmin}>Quản lí bài viết</Link>,
            '8',
            <IconWriting stroke={1} fontSize={18} />,
        ),
        getItem(<Link to={config.routes.account}>Quản lí tài khoản</Link>, '9', <IconUsers stroke={1} fontSize={18} />),
        getItem('Quản lý tác vụ', '10', <IconStack2 stroke={1} fontSize={18} />, [
            getItem(<Link to={config.routes.banner}>Banner</Link>, '11', <IconPhotoScan stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.images}>Images</Link>, '12', <IconPhotoSearch stroke={1} fontSize={18} />),
            getItem(<Link to={config.routes.owner}>Owner</Link>, '13', <IconTower stroke={1} fontSize={18} />),
        ]),
    ];

    return <Menu theme="dark" mode="inline" items={items} />;
}

export default MenuAdmin;
