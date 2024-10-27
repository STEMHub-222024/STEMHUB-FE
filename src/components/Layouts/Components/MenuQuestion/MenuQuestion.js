import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { getTopLast30days, getTopLast7days } from '~/services/chatbotServices';

const MenuQuestion = () => {
    const [items, setItems] = useState();

    useEffect(() => {
        (async () => {
            const [data7Days, data30Days] = await Promise.all([getTopLast7days(), getTopLast30days()]);
            setItems([
                {
                    key: 'sub1',
                    label: 'Những câu hỏi được hỏi nhiều nhất trong 7 ngày',
                    type: 'group',
                    children: data7Days.map((item) => {
                        return {
                            key: `7days_${item.questionId}`,
                            label: item.content,
                        };
                    }),
                },
                {
                    type: 'divider',
                },
                {
                    key: 'sub2',
                    label: 'Những câu hỏi được hỏi nhiều nhất trong 1 tháng',
                    type: 'group',
                    children: data30Days.map((item) => {
                        return {
                            key: `30days_${item.questionId}`,
                            label: item.content,
                        };
                    }),
                },
            ]);
        })();
    }, []);

    const onClick = (e) => {
        console.log('click ', e);
    };

    return (
        <Menu
            onClick={onClick}
            style={{
                width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    );
};

export default MenuQuestion;
