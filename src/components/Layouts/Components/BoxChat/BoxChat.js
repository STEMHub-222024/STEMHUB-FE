import { Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import config from '~/config';
import { dataTopicCareer } from '../BoxChat/mockData';
import { ask, sendQuestion } from '~/services/chatbotServices';

import BoxMessage from '../BoxMessage';
import CareerBoxMessage from '../CareerBoxMessage';

import styles from './BoxChat.module.scss';
import { toast } from 'react-toastify';
import { marked } from 'marked';
import images from '~/assets/images';
import IconCircleStop from '~/components/Common/Icons/IconCircleStop';

const BoxChat = ({ data }) => {
    const inputChatRef = useRef(null);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isDisplayStopped, setIsDisplayStopped] = useState(false);
    const typingAbortControllerRef = useRef(null);

    const typeWords = useCallback((words) => {
        if (typingAbortControllerRef.current) {
            typingAbortControllerRef.current.abort();
        }

        typingAbortControllerRef.current = new AbortController();
        const signal = typingAbortControllerRef.current.signal;

        let timeoutIds = [];

        return new Promise((resolve) => {
            let currentMessage = '';
            words.forEach((word, index) => {
                const timeoutId = setTimeout(() => {
                    if (signal.aborted) {
                        timeoutIds.forEach((id) => clearTimeout(id));
                        timeoutIds = [];
                        return;
                    }

                    currentMessage += `${word} `;
                    setMessages((currentMessages) => {
                        const updatedMessages = [...currentMessages];
                        if (updatedMessages[updatedMessages.length - 1]?.role === 'assistant') {
                            updatedMessages[updatedMessages.length - 1].message = currentMessage;
                        } else {
                            updatedMessages.push({ role: 'assistant', message: currentMessage });
                        }
                        return updatedMessages;
                    });

                    if (index === words.length - 1) {
                        setIsDisplayStopped(false);
                        resolve();
                    }
                }, 75 * index);
                timeoutIds.push(timeoutId);
            });

            signal.addEventListener('abort', () => {
                timeoutIds.forEach((id) => clearTimeout(id));
                timeoutIds = [];
                resolve();
            });
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
            setIsTyping(true);
            try {
                let data;
                let isError = false;
                data = dataTopicCareer.find((data) => data.question === message);
                if (data?.answer && data?.id !== 5) {
                    setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);
                    setIsDisplayStopped(true);
                    await typeWords(data.answer.split(' '));
                    return;
                }
                if (message.length > 8 && data?.id !== 5) {
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
                        data = await config.runGemini(data?.id == 5 ? data?.answer : message);
                        await sendQuestion({ content: data?.id == 5 ? data?.question : message, answer: data });
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
                setIsDisplayStopped(true);
                await typeWords(data.split(' '));
            } catch (error) {
                toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
            } finally {
                setIsTyping(false);
            }
        },
        [messages, typeWords],
    );

    const handleSubmit = useCallback(async () => {
        setIsTyping(true);
        inputChatRef.current?.focus();
        setMessages((prevMessages) => [...prevMessages, { role: 'user', message: message }]);

        await handleAskAI(message);
    }, [handleAskAI, message]);

    const handleSendIcon = useCallback(
        async (event) => {
            if (!isTyping && event.type === 'click' && message.trim()) {
                handleSubmit();
            }
        },
        [handleSubmit, isTyping, message],
    );

    const handleEnter = useCallback(
        (event) => {
            if (event.key === 'Enter' && message.trim()) {
                handleSubmit();
            }
        },
        [handleSubmit, message],
    );

    const handleStop = useCallback(() => {
        if (typingAbortControllerRef.current) {
            typingAbortControllerRef.current.abort();
        }
        setIsDisplayStopped(false);
    }, []);

    useEffect(() => {
        if (data) {
            setMessages(data);
        } else {
            const savedMessages = sessionStorage.getItem('chatMessages');
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        }
    }, [data]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.messGroup} style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <img src={images.logo} alt="STEM AI logo" style={{ width: 50, height: 50 }} />
                    <h3 style={{ fontWeight: 'bold', marginTop: '-12px' }}>STEM AI</h3>
                    <p style={{ textAlign: 'center', maxWidth: 600, marginTop: '-12px' }}>
                        STEM AI là một công cụ hỗ trợ học tập STEM vật lí hiệu quả, cung cấp kiến thức và giải đáp thắc
                        mắc giúp học sinh năng cao hiểu biết và tư duy sáng tạo trong lĩnh vực này.
                    </p>
                </div>
                <CareerBoxMessage data={dataTopicCareer} onAskAI={handleAskAI} />
                {messages.map((item, index) => {
                    if (item.role === 'assistant') {
                        return (
                            <div className={styles.assistant} key={index}>
                                <img
                                    src={images.logo}
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
            {isDisplayStopped && (
                <div className={styles['btn-stop']}>
                    <button onClick={handleStop}>
                        <IconCircleStop />
                        Dừng lại
                    </button>
                </div>
            )}
            <div className={styles.inputChat} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <textarea
                    ref={inputChatRef}
                    value={message}
                    className={styles.input}
                    type="text"
                    placeholder={'Nhập câu hỏi của bạn...'}
                    onChange={handleChangeMessage}
                    rows={4}
                    onKeyDown={handleEnter}
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
