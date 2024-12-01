import { useState, useRef, useCallback } from 'react';
import { Drawer, Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import BoxMessage from '~/components/Layouts/Components/BoxMessage';
import styles from './ModalChat.module.scss';

// GeminiAI
import config from '~/config';
import { ask, sendQuestion } from '~/services/chatbotServices';
import { toast } from 'react-toastify';
import { marked } from 'marked';

const ModalChat = ({ isOpen, setIsOpen }) => {
    const inputChatRef = useRef(null);
    const [messages, setMessages] = useState(() => {
        const savedMessages = JSON.parse(sessionStorage.getItem('chatMessages'));
        return savedMessages || [{ role: 'assistant', message: 'Chào mừng đến với STEM AI' }];
    });
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const typeWords = useCallback((words) => {
        let currentMessage = '';
        words.forEach((word, index) => {
            setTimeout(() => {
                currentMessage += word + ' ';
                setMessages((currentMessages) => {
                    const updatedMessages = [...currentMessages];

                    if (updatedMessages[updatedMessages.length - 1]?.role === 'assistant') {
                        updatedMessages[updatedMessages.length - 1].message = currentMessage;
                    } else {
                        updatedMessages.push({
                            role: 'assistant',
                            message: currentMessage,
                        });
                    }
                    return updatedMessages;
                });
            }, 75 * index);
        });
    }, []);

    const handleAskAI = useCallback(async () => {
        let data;
        let isError = false;
        if (message.length > 8) {
            try {
                const { answer, found } = await ask({ question: message });
                if (!found) {
                    isError = true;
                } else {
                    data = answer;
                }
            } catch (error) {
                isError = true;
            }
        } else {
            isError = true;
        }
        if (isError) {
            try {
                data = await config.runGemini(message);
                await sendQuestion({ content: message, answer: data });
            } catch (error) {
                toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
                return;
            }
        }
        sessionStorage.setItem(
            'chatMessages',
            JSON.stringify([...messages, { role: 'user', message: message }, { role: 'assistant', message: data }]),
        );
        setMessage('');
        setIsTyping(false);
        typeWords(data.split(' '));
    }, [message, messages, typeWords]);

    // const handleSendInput = useCallback(
    //     async (event) => {
    //         if (!isTyping && event.key === 'Enter' && message.trim()) {
    //             setIsTyping(true);
    //             inputChatRef.current?.focus();
    //             setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

    //             await handleAskAI();
    //         }
    //     },
    //     [isTyping, message, handleAskAI],
    // );

    const handleSendIcon = useCallback(
        async (event) => {
            if (!isTyping && event.type === 'click' && message.trim()) {
                setIsTyping(true);
                inputChatRef.current?.focus();
                setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

                await handleAskAI();
            }
        },
        [handleAskAI, isTyping, message],
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
            title={'CHAT STEM AI'}
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
                    backgroundColor: '#f6f5f0',
                    color: '#3d3929',
                },
                header: {
                    borderBottom: '1px solid #cccc',
                },
            }}
            zIndex={99999}
        >
            <div className={styles.messGroup}>
                {messages.map((item, index) => {
                    if (item.role === 'assistant') {
                        return (
                            <div  key={index} className={styles.assistant}>
                                <img
                                    src="logo.png"
                                    alt="assistant-icon"
                                    className={`${styles.img}`}
                                    style={{ width: 35, height: 35 }}
                                />
                                <span
                                    key={index}
                                    style={{ maxWidth: '60%' }}
                                    dangerouslySetInnerHTML={{ __html: marked(item.message) }}
                                ></span>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} style={{}} className={styles.user}>
                                <span dangerouslySetInnerHTML={{ __html: marked(item.message) }}></span>
                            </div>
                        );
                    }
                })}
                {isTyping && <BoxMessage data={{ role: 'assistant', message: 'Đang tải...' }} />}
            </div>

            <div className={styles.inputChat}>
                <textarea
                    ref={inputChatRef}
                    value={message}
                    className={styles.input}
                    type="text"
                    placeholder={'Nhập câu hỏi của bạn...'}
                    onChange={handleChangeMessage}
                    // onKeyDown={handleSendInput}
                    rows={4}
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
