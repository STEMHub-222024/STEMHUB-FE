import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { marked } from 'marked';
import styles from './BoxMessage.module.scss';
import images from '~/assets/images';

const BoxMessage = ({ data }) => {
    const convertMarkdownToHtml = (markdown) => {
        return marked(markdown);
    };

    return (
        <div className={`${data.role === 'assistant' ? styles.messChatAI : styles.messChat}`}>
            <div className={styles.boxChat}>
                <p dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(data.message ?? '') }}></p>
            </div>
            {data.role === 'assistant' ? (
                <img
                    src={images.logo}
                    alt="assistant-icon"
                    className={`${styles.img}`}
                    style={{ width: 35, height: 35 }}
                />
            ) : (
                <Avatar className={`${styles.user} ${styles.img}`} size={35} icon={<UserOutlined />} />
            )}
        </div>
    );
};

export default BoxMessage;
