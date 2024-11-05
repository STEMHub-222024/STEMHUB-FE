import classNames from 'classnames/bind';
import { useState, useCallback, memo } from 'react';
import { Badge, Space } from 'antd';
import ModalChat from '~/components/Layouts/Components/ModalChat';
import { IconCircleChevronsUp, IconCircleChevronsDown, IconRobot, IconMessageChatbot } from '@tabler/icons-react';
import scrollToPosition from '~/utils/scrollToPosition';
import styles from './OptionPublic.module.scss';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function OptionPublic() {
    const [show, setShow] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    const handleShowModal = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleScrollOn = useCallback(() => {
        setShow((prev) => {
            const newShow = !prev;
            scrollToPosition(newShow ? 0 : document.documentElement.scrollHeight);
            return newShow;
        });
    }, []);

    if (pathname.includes('/stemAI')) return null;

    return (
        <div className={cx('wrapper')}>
            <ModalChat setIsOpen={setIsOpen} isOpen={isOpen} />
            <Space className={cx('body')}>
                <div className={cx('options')}>
                    <Badge
                        className={cx('item')}
                        count={<IconMessageChatbot className={cx('message')} size={25} />}
                        offset={[2, -4]}
                    >
                        <IconRobot className={cx('icon-ai')} size={35} onClick={handleShowModal} />
                    </Badge>
                </div>
                {show ? (
                    <IconCircleChevronsDown className={cx('icon')} onClick={handleScrollOn} />
                ) : (
                    <IconCircleChevronsUp className={cx('icon')} onClick={handleScrollOn} />
                )}
            </Space>
        </div>
    );
}

export default memo(OptionPublic);
