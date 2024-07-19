import classNames from 'classnames/bind';
import { Spin, Layout } from 'antd';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

const { Content } = Layout;
function Loading() {
    return (
        <Layout>
            <Content className={cx('wrapper-loading')}>
                <Spin size="large" className={cx('custom-spin')} />
                <div className={cx('loading-text')}>Loading...</div>
            </Content>
        </Layout>
    );
}

export default Loading;
