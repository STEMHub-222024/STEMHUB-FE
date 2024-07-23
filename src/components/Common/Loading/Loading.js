import classNames from 'classnames/bind';
import { Spin, Layout } from 'antd';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

const { Content } = Layout;
function Loading({ title }) {
    return (
        <Layout className={cx('wrapper')}>
            <Content className={cx('content')}>
                <Spin size="large" className={cx('custom-spin')} />
                <div className={cx('loading-text')}>{title}</div>
            </Content>
        </Layout>
    );
}

export default Loading;
