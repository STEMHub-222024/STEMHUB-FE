import { useState, useRef } from 'react';
import { Modal, Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import BoxMessage from '~/components/Layouts/Components/BoxMessage';
import { marked } from 'marked';
import styles from './ModalChat.module.scss';

// GeminiAI
import config from '~/config';

const ModalChat = ({ isOpen, setIsOpen }) => {
    const inputChatRef = useRef(null);
    const [messages, setMessages] = useState([{ role: 'assistant', message: 'Welcome to Chat AI' }]);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const convertMarkdownToHtml = (markdown) => {
        return marked(markdown);
    };

    const typeWords = (words) => {
        let currentMessage = '';
        words.forEach((word, index) => {
            setTimeout(() => {
                currentMessage += word + ' ';
                setMessages((currentMessages) => {
                    const updatedMessages = [...currentMessages];
                    const latestMessageIndex = updatedMessages.findIndex((msg) => msg.role === 'assistant');

                    if (latestMessageIndex !== -1) {
                        updatedMessages[latestMessageIndex].message = currentMessage;
                    } else {
                        updatedMessages.unshift({
                            role: 'assistant',
                            message: currentMessage,
                        });
                    }

                    return updatedMessages;
                });
            }, 75 * index);
        });
    };

    const handleSendInput = async (event) => {
        if (!isTyping && event.key === 'Enter' && message.trim()) {
            setIsTyping(true);

            setMessages((prevMessages) => [{ role: 'user', message }, ...prevMessages]);

            setMessage('');
            inputChatRef.current?.focus();

            try {
                const res = await config.runGemini(message);
                const htmlResponse = convertMarkdownToHtml(res);
                const newResponse = htmlResponse.split(' ');

                setMessages((prevMessages) => [{ role: 'assistant', message: '' }, ...prevMessages]);

                typeWords(newResponse);
            } catch (error) {
                console.error('Error Gemini:', error);
            } finally {
                setIsTyping(false);
            }
        }
    };

    const handleSendIcon = async (event) => {
        if (!isTyping && event.type === 'click' && message.trim()) {
            setIsTyping(true);
            setMessages((prevMessages) => [{ role: 'user', message }, ...prevMessages]);
            setMessage('');

            inputChatRef.current?.focus();

            try {
                const res = await config.runGemini(message);
                const htmlResponse = convertMarkdownToHtml(res);
                const newResponse = htmlResponse.split(' ');

                setMessages((prevMessages) => [{ role: 'assistant', message: '' }, ...prevMessages]);

                typeWords(newResponse);
            } catch (error) {
                console.error('Error Gemini:', error);
            } finally {
                setIsTyping(false);
            }
        }
    };

    const handleChangeMessage = (event) => {
        const messageValue = event.target.value;
        if (!messageValue.startsWith(' ')) {
            setMessage(messageValue);
        }
    };

    const handleShowModal = () => setIsOpen(!isOpen);

    return (
        <Modal
            title={'CHAT BOX AI'}
            centered
            open={isOpen}
            onOk={handleShowModal}
            onCancel={handleShowModal}
            footer={null}
            classNames={{
                wrapper: styles.modalWrapper,
                body: styles.modalBody,
            }}
            className={styles.modalContent}
        >
            <div className={styles.messGroup}>
                {isTyping && (
                    <div className={styles.typing}>
                        <Spin className={styles.typingIcon} size="small" />
                        <p>{'Loading...'}</p>
                    </div>
                )}
                {messages.map((item, index) => (
                    <BoxMessage key={index} data={item} />
                ))}
            </div>

            <div className={styles.inputChat}>
                <input
                    ref={inputChatRef}
                    value={message}
                    className={styles.input}
                    type="text"
                    placeholder={'Enter your message...'}
                    onChange={handleChangeMessage}
                    onKeyDown={handleSendInput}
                />
                {isTyping ? (
                    <Spin className={styles.typingIcon} indicator={<LoadingOutlined spin />} />
                ) : (
                    <SendOutlined className={styles.typingIcon} onClick={handleSendIcon} />
                )}
            </div>
        </Modal>
    );
};

export default ModalChat;
