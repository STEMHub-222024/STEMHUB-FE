import { Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './BoxChat.module.scss';
import BoxMessage from '../BoxMessage';
import config from '~/config';
import { ask, sendQuestion } from '~/services/chatbotServices';

const BoxChat = ({ data }) => {
    const inputChatRef = useRef(null);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState(() => {
        return data ?? [{ role: 'assistant', message: 'Chào mừng đến với STEM AI' }];
    });

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

    const handleChangeMessage = useCallback((event) => {
        const messageValue = event.target.value;
        if (!messageValue.startsWith(' ')) {
            setMessage(messageValue);
        }
    }, []);

    const handleAskAI = useCallback(async () => {
        try {
            let data;
            const { answer, found } = await ask({ question: message });
            data = answer;
            if (!found) {
                data = await config.runGemini(message);
                await sendQuestion({ content: message, answer: data });
            }
            sessionStorage.setItem(
                'chatMessages',
                JSON.stringify([...messages, { role: 'user', message: message }, { role: 'assistant', message: data }]),
            );
            // setMessages((prevMessages) => [...prevMessages, { role: 'assistant', message: res }]);
            typeWords(data.split(' '));
        } catch (error) {
        } finally {
            setMessage('');
            setIsTyping(false);
        }
    }, [message, messages, typeWords]);

    const handleSendInput = useCallback(
        async (event) => {
            if (!isTyping && event.key === 'Enter' && message.trim()) {
                setIsTyping(true);
                inputChatRef.current?.focus();
                setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

                await handleAskAI();
            }
        },
        [isTyping, message, handleAskAI],
    );

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

    useEffect(() => {
        if (data) {
            setMessages(data);
        } else {
            setMessages([{ role: 'assistant', message: 'Chào mừng đến với STEM AI' }]);
        }
    }, [data]);

    return (
        <div className={styles.wrapper}>
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
        </div>
    );
};

export default BoxChat;
