import { Avatar } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

import styles from './CareerBoxMessage.module.scss';

const CareerBoxMessage = ({ data, onAskAI }) => {
    return (
        <div className={styles.messChatAI}>
            <Avatar className={`${styles.assistant} ${styles.img}`} size={35} icon={<OpenAIOutlined />} />
            <div className={styles.boxChat}>
                {data.map((item) => (
                    <p className={styles.title} onClick={() => onAskAI(item.question)}>
                        {item.question}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default CareerBoxMessage;
