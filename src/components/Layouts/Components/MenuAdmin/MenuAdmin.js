import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    IconDashboard,
    IconUsers,
    IconBook,
    IconBook2,
    IconWriting,
    IconPhotoSearch,
    IconSteam,
    IconPhotoScan,
    IconTower,
    IconFlask2,
    IconTools,
} from '@tabler/icons-react';
import config from '~/config';

function MenuAdmin() {
    const defaultSelectMenu = localStorage.getItem('defaultSelectMenu');
    const [defaultSelect, setDefaultSelect] = useState(defaultSelectMenu ?? '1');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('defaultSelectMenu', defaultSelect);
    }, [defaultSelect]);
    const items = [
        {
            key: '1',
            icon: <IconDashboard stroke={1} fontSize={18} />,
            label: 'Dashboard',
            to: config.routes.admin,
        },
        {
            key: '2',
            icon: <IconUsers stroke={1} fontSize={18} />,
            label: 'Account',
            to: config.routes.account,
        },
        {
            key: '3',
            icon: <IconSteam stroke={1} fontSize={18} />,
            label: 'STEM',
            to: config.routes.stem,
        },
        {
            key: '4',
            icon: <IconBook stroke={1} fontSize={18} />,
            label: 'Topic',
            to: config.routes.topicAdmin,
        },
        {
            key: '5',
            icon: <IconBook2 stroke={1} fontSize={18} />,
            label: 'Lesson',
            to: config.routes.lesson,
        },
        {
            key: '6',
            icon: <IconWriting stroke={1} fontSize={18} />,
            label: 'Posts',
            to: config.routes.postsAdmin,
        },
        {
            key: '7',
            icon: <IconPhotoScan stroke={1} fontSize={18} />,
            label: 'Banner',
            to: config.routes.banner,
        },
        {
            key: '8',
            icon: <IconFlask2 stroke={1} fontSize={18} />,
            label: 'Scientist',
            to: config.routes.scientistAdmin,
        },
        {
            key: '9',
            icon: <IconPhotoSearch stroke={1} fontSize={18} />,
            label: 'Images',
            to: config.routes.images,
        },
        {
            key: '10',
            icon: <IconTower stroke={1} fontSize={18} />,
            label: 'Owner',
            to: config.routes.owner,
        },
        {
            key: '11',
            icon: <IconTools stroke={1} fontSize={18} />,
            label: 'Parts',
            to: config.routes.parts,
        },
    ];

    function handleRouter(e) {
        const menuItem = items.find((item) => item.key === e.key);
        if (menuItem) {
            setDefaultSelect(menuItem.key);
            navigate(menuItem.to);
        }
    }

    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultSelect]} items={items} onClick={handleRouter} />
    );
}

export default MenuAdmin;
