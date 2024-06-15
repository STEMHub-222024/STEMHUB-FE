import { UserOutlined, OpenAIOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { marked } from 'marked';
import styles from './BoxMessage.module.scss';

const BoxMessage = ({ data }) => {
    const convertMarkdownToHtml = (markdown) => {
        return marked(markdown);
    };

    return (
        <div className={`${data.role === 'assistant' ? styles.messChatAI : styles.messChat}`}>
            <div className={styles.boxChat}>
                <p dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(data.message ?? '') }}></p>
            </div>
            <Avatar
                className={`${data.role === 'assistant' ? styles.assistant : styles.user} ${styles.img}`}
                size={35}
                icon={data.role === 'assistant' ? <OpenAIOutlined /> : <UserOutlined />}
            />
        </div>
    );
};

export default BoxMessage;
