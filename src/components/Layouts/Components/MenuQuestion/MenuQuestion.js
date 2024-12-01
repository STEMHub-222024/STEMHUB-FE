import React, { useEffect, useState } from 'react';

import { Menu } from 'antd';
import { getTopLast30days, getTopLast7days } from '~/services/chatbotServices';
import images from '~/assets/images';

const MenuQuestion = ({ onSetQuestion }) => {
    const [items, setItems] = useState();
    const [data7Days, setData7Days] = useState();
    const [data30Days, setData30Days] = useState();

    useEffect(() => {
        (async () => {
            const [data7Days, data30Days] = await Promise.all([getTopLast7days(), getTopLast30days()]);
            setData7Days(data7Days);
            setData30Days(data30Days);
            setItems([
                {
                    key: 'newChat',
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img src={images.logo} alt="assistant-icon" style={{ width: 30, height: 30 }} />
                            <span>STEM AI</span>
                        </div>
                    ),
                },
                {
                    key: '7days',
                    label: 'Những câu hỏi được hỏi nhiều nhất trong 7 ngày',
                    type: 'group',
                    children: data7Days?.map((item) => {
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
                    key: '30days',
                    label: 'Những câu hỏi được hỏi nhiều nhất trong 1 tháng',
                    type: 'group',
                    children: data30Days?.map((item) => {
                        return {
                            key: `30days_${item.questionId}`,
                            label: item.content,
                        };
                    }),
                },
            ]);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClick = (e) => {
        if (e.key === 'newChat') {
            onSetQuestion([]);
            return;
        }

        const key = e.key.split('_')[0];
        const id = e.key.split('_')[1];
        let questionData;
        switch (key) {
            case '7days':
                questionData = data7Days.find((d) => d.questionId === id);
                break;
            case '30days':
                questionData = data30Days.find((d) => d.questionId === id);
                break;
            default:
                break;
        }
        const { content, answer } = questionData;
        onSetQuestion([
            { role: 'user', message: content },
            { role: 'assistant', message: answer },
        ]);
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
