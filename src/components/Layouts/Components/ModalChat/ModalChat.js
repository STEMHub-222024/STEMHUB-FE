import { useState, useRef, useCallback } from 'react';
import { Drawer, Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import BoxMessage from '~/components/Layouts/Components/BoxMessage';
import styles from './ModalChat.module.scss';

// GeminiAI
import config from '~/config';

const ModalChat = ({ isOpen, setIsOpen }) => {
    const inputChatRef = useRef(null);
    const [messages, setMessages] = useState(() => {
        const savedMessages = JSON.parse(sessionStorage.getItem('chatMessages'));
        return savedMessages || [{ role: 'assistant', message: 'Chào mừng đến với STEM AI' }];
    });
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // const typeWords = useCallback((words) => {
    //     let currentMessage = '';
    //     words.forEach((word, index) => {
    //         setTimeout(() => {
    //             currentMessage += word + ' ';
    //             setMessages((currentMessages) => {
    //                 const updatedMessages = [...currentMessages];
    //                 const latestMessageIndex = updatedMessages.findIndex((msg) => msg.role === 'assistant');

    //                 if (latestMessageIndex !== -1) {
    //                     updatedMessages[latestMessageIndex].message = currentMessage;
    //                 } else {
    //                     updatedMessages.unshift({
    //                         role: 'assistant',
    //                         message: currentMessage,
    //                     });
    //                 }

    //                 return updatedMessages;
    //             });
    //         }, 75 * index);
    //     });
    // }, []);

    const handleSendInput = useCallback(
        async (event) => {
            if (!isTyping && event.key === 'Enter' && message.trim()) {
                setIsTyping(true);
                inputChatRef.current?.focus();
                setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

                try {
                    const res = await config.runGemini(message);
                    // const newResponse = res.split(' ');
                    sessionStorage.setItem(
                        'chatMessages',
                        JSON.stringify([
                            ...messages,
                            { role: 'user', message: message },
                            { role: 'assistant', message: res },
                        ]),
                    );
                    setMessages((prevMessages) => [...prevMessages, { role: 'assistant', message: res }]);
                    // typeWords(newResponse);
                } catch (error) {
                } finally {
                    setMessage('');
                    setIsTyping(false);
                }
            }
        },
        [isTyping, message, messages],
    );

    const handleSendIcon = useCallback(
        async (event) => {
            if (!isTyping && event.type === 'click' && message.trim()) {
                setIsTyping(true);
                inputChatRef.current?.focus();
                setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

                try {
                    const res = await config.runGemini(message);
                    // const newResponse = res.split(' ');
                    sessionStorage.setItem(
                        'chatMessages',
                        JSON.stringify([
                            ...messages,
                            { role: 'user', message: message },
                            { role: 'assistant', message: res },
                        ]),
                    );
                    setMessages((prevMessages) => [...prevMessages, { role: 'assistant', message: res }]);
                    // typeWords(newResponse);
                } catch (error) {
                } finally {
                    setMessage('');
                    setIsTyping(false);
                }
            }
        },
        [isTyping, message, messages],
    );

    const handleChangeMessage = useCallback((event) => {
        const messageValue = event.target.value;
        if (!messageValue.startsWith(' ')) {
            setMessage(messageValue);
        }
    }, []);

    const handleShowModal = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

    return (
        <Drawer
            closable
            destroyOnClose
            title={'CHAT BOX AI'}
            placement="right"
            open={isOpen}
            onClose={handleShowModal}
            size="large"
            styles={{
                body: {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    scrollbarWidth: 'thin',
                },
            }}
            zIndex={99999}
        >
            <div className={styles.messGroup} style={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((item, index) => (
                    <BoxMessage key={index} data={item} />
                ))}
                {isTyping && <BoxMessage data={{ role: 'assistant', message: 'Đang tải...' }} />}
            </div>

            <div className={styles.inputChat} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <input
                    ref={inputChatRef}
                    value={message}
                    className={styles.input}
                    type="text"
                    placeholder={'Nhập tin nhắn của bạn...'}
                    onChange={handleChangeMessage}
                    onKeyDown={handleSendInput}
                    style={{
                        width: '100%',
                        padding: '8px 16px',
                        border: '1px solid #ccc',
                        borderRadius: '24px',
                        height: '48px',
                        fontSize: '1.25rem',
                    }}
                />
                {isTyping ? (
                    <Spin
                        className={styles.typingIcon}
                        indicator={<LoadingOutlined spin />}
                        style={{ fontSize: '24px' }}
                    />
                ) : (
                    <SendOutlined className={styles.typingIcon} onClick={handleSendIcon} style={{ fontSize: '24px' }} />
                )}
            </div>
        </Drawer>
    );
};

export default ModalChat;
