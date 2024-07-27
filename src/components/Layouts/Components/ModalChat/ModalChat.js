import { useState, useRef, useCallback } from 'react';
import { Modal, Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import BoxMessage from '~/components/Layouts/Components/BoxMessage';
import styles from './ModalChat.module.scss';

// GeminiAI
import config from '~/config';
import { useDebounce } from '~/hooks';

const ModalChat = ({ isOpen, setIsOpen }) => {
    const inputChatRef = useRef(null);
    const [messages, setMessages] = useState(() => {
        const savedMessages = JSON.parse(sessionStorage.getItem('chatMessages'));
        return savedMessages || [{ role: 'assistant', message: 'Chào mừng đến với STEM AI' }];
    });
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const debouncedMessage = useDebounce(message, 300);

    const typeWords = useCallback((words) => {
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
    }, []);

    const handleSendInput = useCallback(
        async (event) => {
            if (!isTyping && event.key === 'Enter' && message.trim()) {
                setIsTyping(true);
                setMessages((prevMessages) => [{ role: 'user', message }, ...prevMessages]);
                setMessage('');
                inputChatRef.current?.focus();

                try {
                    const res = await config.runGemini(message);
                    const newResponse = res.split(' ');
                    sessionStorage.setItem(
                        'chatMessages',
                        JSON.stringify([{ role: 'assistant', message: res }, { role: 'user', message }, ...messages]),
                    );
                    setMessages((prevMessages) => [{ role: 'assistant', message: '' }, ...prevMessages]);
                    typeWords(newResponse);
                } catch (error) {
                    console.error('Error Gemini:', error);
                } finally {
                    setIsTyping(false);
                }
            }
        },
        [isTyping, message, typeWords, messages],
    );

    const handleSendIcon = useCallback(
        async (event) => {
            if (!isTyping && event.type === 'click' && message.trim()) {
                setIsTyping(true);
                setMessages((prevMessages) => [{ role: 'user', message }, ...prevMessages]);
                setMessage('');
                inputChatRef.current?.focus();

                try {
                    const res = await config.runGemini(message);
                    const newResponse = res.split(' ');
                    sessionStorage.setItem(
                        'chatMessages',
                        JSON.stringify([{ role: 'assistant', message: res }, { role: 'user', message }, ...messages]),
                    );
                    setMessages((prevMessages) => [{ role: 'assistant', message: '' }, ...prevMessages]);
                    typeWords(newResponse);
                } catch (error) {
                    console.error('Error Gemini:', error);
                } finally {
                    setIsTyping(false);
                }
            }
        },
        [isTyping, message, typeWords, messages],
    );

    const handleChangeMessage = useCallback((event) => {
        const messageValue = event.target.value;
        if (!messageValue.startsWith(' ')) {
            setMessage(messageValue);
        }
    }, []);

    const handleShowModal = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

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
                        <p>{'Đang tải...'}</p>
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
                    placeholder={'Nhập tin nhắn của bạn...'}
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
