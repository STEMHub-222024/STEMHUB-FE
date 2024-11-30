import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout } from 'antd';
import Image from '~/components/Common/Image';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '~/app/selectors';
import useUserInfo from '~/hooks/useUserInfo';
import { useCallback } from 'react';
import { logout } from '~/app/slices/authSlice';

import styles from './HeaderAdmin.module.scss';
const { Header } = Layout;

function HeaderAdmin({ collapsed, setCollapsed }) {
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const { data: userInfo } = useUserInfo(infoUserCurrent?.userId);
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const items = [
        {
            label: <span onClick={handleLogout}>Đăng xuất</span>,
            key: '0',
        },
    ];

    return (
        <Header className={styles['header']}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                }}
            />
            <Dropdown menu={{ items }} trigger={['click']}>
                <button className={styles['account']}>
                    <span>{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                    <Image
                        className={styles['user-avatar']}
                        src={userInfo?.image ?? ''}
                        alt={userInfo?.firstName ?? 'Avatar'}
                    />
                </button>
            </Dropdown>
        </Header>
    );
}

export default HeaderAdmin;
