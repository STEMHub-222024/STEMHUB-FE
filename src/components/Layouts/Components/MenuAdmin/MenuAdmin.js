import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IconUsers, IconBook, IconBooks, IconBook2, IconWriting, IconSlideshow } from '@tabler/icons-react';
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
            icon: <IconUsers stroke={1} fontSize={18} />,
            label: 'Learner',
            to: config.routes.learner,
        },
        {
            key: '2',
            icon: <IconBook stroke={1} fontSize={18} />,
            label: 'Stem10',
            to: config.routes.steam10Admin,
        },
        {
            key: '3',
            icon: <IconBook2 stroke={1} fontSize={18} />,
            label: 'Stem11',
            to: config.routes.steam11Admin,
        },
        {
            key: '4',
            icon: <IconBooks stroke={1} fontSize={18} />,
            label: 'Stem12',
            to: config.routes.steam12Admin,
        },
        {
            key: '5',
            icon: <IconWriting stroke={1} fontSize={18} />,
            label: 'Posts',
            to: config.routes.postsAdmin,
        },
        {
            key: '6',
            icon: <IconSlideshow stroke={1} fontSize={18} />,
            label: 'Banner',
            to: config.routes.banner,
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