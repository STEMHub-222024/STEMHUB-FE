import classNames from 'classnames/bind';
import { Flex, Segmented } from 'antd';
import { IconSteam, IconReportSearch } from '@tabler/icons-react';
import { HomeFilled } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import config from '~/config';

import styles from './NavigationBar.module.scss';

const cx = classNames.bind(styles);

function NavigationBar() {
    const location = useLocation();

    const getActiveValue = (pathname) => {
        if (pathname === config.routes.home) return 'Home';
        if (pathname === config.routes.stem10) return 'STEM10';
        if (pathname === config.routes.stem11) return 'STEM11';
        if (pathname === config.routes.stem12) return 'STEM12';
        if (pathname === config.routes.posts) return 'POSTS';
        return 'Home';
    };

    const activeValue = getActiveValue(location.pathname);

    return (
        <Flex className={cx('wrapper')} gap="small" align="flex-start" vertical>
            <Segmented
                size="small"
                className={cx('content')}
                value={activeValue}
                options={[
                    {
                        label: (
                            <Link className={cx('main')} to={config.routes.home}>
                                <HomeFilled className={cx('icon-ant')} />
                                <div className={cx('title')}>Trang chủ</div>
                            </Link>
                        ),
                        value: 'Home',
                    },
                    {
                        label: (
                            <Link className={cx('main')} to={config.routes.stem10}>
                                <IconSteam className={cx('icon')} />
                                <div className={cx('title')}>Stem 10</div>
                            </Link>
                        ),
                        value: 'STEM10',
                    },
                    {
                        label: (
                            <Link className={cx('main')} to={config.routes.stem11}>
                                <IconSteam className={cx('icon')} />
                                <div className={cx('title')}>Stem 11</div>
                            </Link>
                        ),
                        value: 'STEM11',
                    },
                    {
                        label: (
                            <Link className={cx('main')} to={config.routes.stem12}>
                                <IconSteam className={cx('icon')} />
                                <div className={cx('title')}>Stem 12</div>
                            </Link>
                        ),
                        value: 'STEM12',
                    },
                    {
                        label: (
                            <Link className={cx('main')} to={config.routes.posts}>
                                <IconReportSearch className={cx('icon')} />
                                <div className={cx('title')}>Bài viết</div>
                            </Link>
                        ),
                        value: 'POSTS',
                    },
                ]}
            />
        </Flex>
    );
}

export default NavigationBar;
