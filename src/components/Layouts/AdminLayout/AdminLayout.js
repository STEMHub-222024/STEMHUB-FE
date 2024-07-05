import classNames from 'classnames/bind';
import { useState } from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import MenuAdmin from '~/components/Layouts/Components/MenuAdmin';
import HeaderAdmin from '~/components/Layouts/Components/HeaderAdmin';

import styles from './AdminLayout.module.scss';
import Heading from '~/components/Common/Heading';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const { Sider } = Layout;

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <Link to={routes.home} className={cx('logo-admin')}>
                    <Heading h3 className={cx('heading')}>
                        Stem
                    </Heading>
                </Link>
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
