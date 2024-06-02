import classNames from 'classnames/bind';
import { useState } from 'react';
import { Layout } from 'antd';
import MenuAdmin from '~/components/Layouts/Components/MenuAdmin';
import HeaderAdmin from '~/components/Layouts/Components/HeaderAdmin';

import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

const { Sider } = Layout;

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className={cx('logo-admin')}>
                    <h3>STEM</h3>
                </div>
                <MenuAdmin />
            </Sider>
            <Layout>
                <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
                {children}
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
