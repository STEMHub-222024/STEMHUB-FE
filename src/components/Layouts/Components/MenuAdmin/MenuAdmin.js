import React, { useState } from 'react';
import { Menu } from 'antd';
import { IconUsers, IconBook, IconBooks, IconBook2, IconWriting, IconSlideshow } from '@tabler/icons-react';

function MenuAdmin() {
    const defaultSelectMenu = localStorage.getItem('defaultSelectMenu');
    const [defaultSelect, setDefaultSelect] = useState(defaultSelectMenu ?? '1');
    localStorage.setItem('defaultSelectMenu', defaultSelect);
    const items = [
        {
            key: '1',
            icon: <IconUsers stroke={1} fontSize={18} />,
            label: 'Customer',
            to: '/',
        },
        {
            key: '2',
            icon: <IconBook stroke={1} fontSize={18} />,
            label: 'Stem10',
            to: '/',
        },
        {
            key: '3',
            icon: <IconBook2 stroke={1} fontSize={18} />,
            label: 'Stem11',
            to: '/',
        },
        {
            key: '4',
            icon: <IconBooks stroke={1} fontSize={18} />,
            label: 'Stem12',
            to: '/',
        },
        {
            key: '5',
            icon: <IconWriting stroke={1} fontSize={18} />,
            label: 'Posts',
            to: '/',
        },
        {
            key: '6',
            icon: <IconSlideshow stroke={1} fontSize={18} />,
            label: 'Banner',
            to: '/',
        },
    ];

    function handleRouter(e) {
        const menuItem = items.find((item) => item.key === e.key);
        setDefaultSelect(menuItem.key);
    }

    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultSelect]} items={items} onClick={handleRouter} />
    );
}

export default MenuAdmin;
