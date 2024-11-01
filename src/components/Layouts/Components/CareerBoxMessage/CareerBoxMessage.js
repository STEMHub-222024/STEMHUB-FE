import { Avatar } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

import styles from './CareerBoxMessage.module.scss';

const data = [
    {
        id: 1,
        topic: 'STEM ngành kỹ thuật xây dựng dân dụng và công nghiệp',
        questions: [
            'Chủ đề STEM chống sét cho ngôi nhà',
            'Chủ đề STEM nhà chống bão',
            'Chủ đề STEM báo cháy cho ngôi nhà',
            'Chủ đề STEM báo trộm cho ngôi nhà',
            'Chủ đề STEM nhà chống lũ',
        ],
    },
    {
        id: 2,
        topic: 'STEM ngành kỹ thuật môi trường',
        questions: [
            'Chủ đề STEM ô nhiễm tiếng ồn do phương tiện GTVT',
            'Chủ đề STEM ô nhiễm nguồn nước do phương tiện GTVT',
            'Chủ đề STEM ô nhiễm nguồn nước do phương tiện GTVT',
            'Chủ đề STEM ô nhiễm không khí do phương tiện GTVT',
        ],
    },
    {
        id: 3,
        topic: 'STEM ngành năng lượng',
        questions: [
            'Chủ đề STEM tìm kiếm các nguồn năng lượng xanh',
            'Chủ đề STEM sản xuất điện năng',
            'Chủ đề STEM nâng cao hiệu suất sử dụng nhiên liệu',
            'Chủ đề STEM sản xuất năng lượng sinh học –  Biogas',
            'Chủ đề STEM phân bố các ngành công nghiệp năng lượng ở nước ta',
        ],
    },
    {
        id: 4,
        topic: 'STEM liên ngành kỹ thuật cơ khí giao thông và điện - điện tử',
        questions: [
            'Chủ đề STEM thiết kế phanh từ',
            'Chủ đề STEM thiết kế máy dò kim loại',
            'Chủ đề STEM sản xuất điện gió thắp sáng trong đường hầm',
            'Chủ đề STEM thiết kế hệ thống điều khiển giao thông thông minh',
        ],
    },
];

const CareerBoxMessage = ({ onAskAI }) => {
    return (
        <div className={styles.messChatAI}>
            <Avatar className={`${styles.assistant} ${styles.img}`} size={35} icon={<OpenAIOutlined />} />
            <div className={styles.boxChat}>
                {data.map((item) => (
                    <div key={item.id}>
                        <p className={styles.title}>{item.topic}</p>
                        <ul>
                            {item.questions.map((question, id) => (
                                <li key={id} onClick={() => onAskAI(question)}>
                                    {question}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerBoxMessage;
