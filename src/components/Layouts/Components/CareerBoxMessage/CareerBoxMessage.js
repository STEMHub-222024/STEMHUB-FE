import { Avatar } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

import styles from './CareerBoxMessage.module.scss';

const CareerBoxMessage = ({ data, onAskAI }) => {
    return (
        <div className={styles.messChatAI}>
            <Avatar className={`${styles.assistant} ${styles.img}`} size={35} icon={<OpenAIOutlined />} />
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                {data.map((item, id) => (
                    <div
                        key={id}
                        style={{
                            border: '2px solid #7f56d9',
                            padding: 8,
                            borderRadius: 16,
                            width: 'fit-content',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                        className={styles.title}
                        onClick={() => onAskAI(item.question)}
                    >
                        {item.question}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerBoxMessage;
