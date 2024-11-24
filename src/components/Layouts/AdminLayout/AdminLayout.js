import { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { Link } from 'react-router-dom';
import MenuAdmin from '~/components/Layouts/Components/MenuAdmin';
import HeaderAdmin from '~/components/Layouts/Components/HeaderAdmin';

import routes from '~/config/routes';
import images from '~/assets/images';

const { Sider } = Layout;

function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        siderBg: '#f0f0f0',
                        colorText: '#000000',
                    },
                    Menu: {
                        darkItemBg: '#f0f0f0',
                        groupTitleColor: '#000000',
                        darkItemColor: '#000000',
                        darkSubMenuItemBg: '#f0f0f0',
                        darkItemHoverColor: '#7f56d9',
                        darkItemSelectedBg: '#7f56d9',
                        darkPopupBg: '#f0f0f0',
                        darkItemSelectedColor: '#000000',
                    },
                },
            }}
        >
            <Layout style={{ width: '100vw', height: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Link to={routes.admin} style={{ display: 'flex', margin: '16px 0px', justifyContent: 'center' }}>
                        <img
                            src={images.logo}
                            alt="STEM AI logo"
                            style={{ width: collapsed ? 32 : 80, height: collapsed ? 32 : 80 }}
                        />
                    </Link>
                    <MenuAdmin />
                </Sider>
                <Layout style={{ width: '100vw', height: '100vh', overflowY: 'scroll' }}>
                    <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
                    {children}
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}

export default AdminLayout;
