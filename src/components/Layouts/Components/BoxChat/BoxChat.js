import { Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import config from '~/config';
import { dataTopicCareer } from '../BoxChat/mockData';
import { ask, sendQuestion } from '~/services/chatbotServices';

import BoxMessage from '../BoxMessage';
import CareerBoxMessage from '../CareerBoxMessage';

import styles from './BoxChat.module.scss';
import { toast } from 'react-toastify';

const BoxChat = ({ data }) => {
    const inputChatRef = useRef(null);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let [searchParams, _] = useSearchParams();
    const topic = searchParams.get('topic');
    const [messages, setMessages] = useState([]);

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

    const handleAskAI = useCallback(
        async (message) => {
            let data;
            let isError = false;
            if (topic === 'career') {
                data = dataTopicCareer.find((data) => data.question === message);
                if (data?.answer) {
                    setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);
                    typeWords(data.answer.split(' '));
                    setIsTyping(false);
                    return;
                }
            }
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
        },
        [messages, topic, typeWords],
    );

    const handleSendInput = useCallback(
        async (event) => {
            if (!isTyping && event.key === 'Enter' && message.trim()) {
                setIsTyping(true);
                inputChatRef.current?.focus();
                setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

                await handleAskAI(message);
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

                await handleAskAI(message);
            }
        },
        [handleAskAI, isTyping, message],
    );

    useEffect(() => {
        if (data) {
            setMessages(data);
            return;
        }
        if (topic) {
            setMessages([]);
            return;
        }
        setMessages([{ role: 'assistant', message: 'Chào bạn &#128075; Tôi là có thế giúp gì cho bạn ?' }]);
    }, [data, topic]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.messGroup} style={{ display: 'flex', flexDirection: 'column' }}>
                {topic !== 'career' && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <img src="logo.png" alt="STEM AI logo" style={{ width: 50, height: 50 }} />
                        <h3 style={{ fontWeight: 'bold' }}>STEM AI</h3>
                        <p style={{ textAlign: 'center', maxWidth: 600 }}>
                            STEM AI là một công cụ hỗ trợ học tập STEM vật lí hiệu quả, cung cấp kiến thức và giải đáp
                            thắc mắc giúp học sinh năng cao hiểu biết và tư duy sáng tạo trong lĩnh vực này.
                        </p>
                    </div>
                )}
                {topic === 'career' && <CareerBoxMessage data={dataTopicCareer} onAskAI={handleAskAI} />}
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
