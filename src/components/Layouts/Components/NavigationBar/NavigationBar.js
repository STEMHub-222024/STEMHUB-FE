import { useMemo, memo } from 'react';
import classNames from 'classnames/bind';
import { Flex, Segmented } from 'antd';
import { IconHome, IconSteam, IconReportSearch } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import config from '~/config';
import styles from './NavigationBar.module.scss';

const cx = classNames.bind(styles);

const NavigationBar = memo(() => {
    const location = useLocation();

    const getActiveValue = useMemo(() => {
        const pathname = location.pathname;
        if (pathname === config.routes.home) return 'Home';
        if (pathname === config.routes.stem10) return 'STEM10';
        if (pathname === config.routes.stem11) return 'STEM11';
        if (pathname === config.routes.stem12) return 'STEM12';
        if (pathname === config.routes.posts) return 'POSTS';
        return 'Home';
    }, [location.pathname]);

    const options = useMemo(
        () => [
            {
                label: (
                    <Link className={cx('main')} to={config.routes.home}>
                        <IconHome className={cx('icon')} />
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
        ],
        [],
    );

    return (
        <Flex className={cx('wrapper')} gap="small" align="flex-start" vertical>
            <Segmented size="small" className={cx('content')} value={getActiveValue} options={options} />
        </Flex>
    );
});

export default NavigationBar;
