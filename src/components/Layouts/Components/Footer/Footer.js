import classNames from 'classnames/bind';
import {
    IconPhone,
    IconMail,
    IconMapPin,
    IconBrandFacebook,
    IconBrandX,
    IconBrandInstagram,
    IconBrandTiktok,
} from '@tabler/icons-react';
import styles from './Footer.module.scss';
import images from '~/assets/images';
import Image from '~/components/Common/Image';
import Heading from '~/components/Common/Heading';
import config from '~/config';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid', { container: 'container' })}>
                <div className={cx('grid-row', { 'content-first': 'content-first' })}>
                    <div
                        className={cx('grid-column-4', {
                            'grid-column-table': true,
                        })}
                    >
                        <div className={cx('trademark')}>
                            <Image src={images.logo} alt="logo" className={cx('logo')} />
                            <Heading className={cx('title')} h2>
                                STEM
                            </Heading>
                        </div>

                        <p className={cx('content')}>
                            Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                    </div>

                    <div className={cx('grid-column-8')}>
                        <div className={cx('grid-row')}>
                            <div
                                className={cx('grid-column-4', {
                                    'item-footer': true,
                                })}
                            >
                                <Heading className={cx('title')} h4>
                                    Đường dẫn nhanh
                                </Heading>

                                <div className={cx('option-one')}>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Youtube
                                    </a>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Tiktok
                                    </a>
                                </div>
                                <div className={cx('option-tow')}>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Facebook
                                    </a>
                                    <a className={cx('link')} href={config.routes.home} style={{ marginLeft: '6px' }}>
                                        Instagram
                                    </a>
                                </div>
                            </div>

                            <div
                                className={cx('grid-column-4', {
                                    'item-footer': true,
                                })}
                            >
                                <Heading className={cx('title')} h4>
                                    Liên hệ chúng tôi
                                </Heading>
                                <div className={cx('contact')}>
                                    <IconPhone size={20} />
                                    <span>0816-788-646</span>
                                </div>
                                <div className={cx('contact')}>
                                    <IconMail size={20} />
                                    <span>nvdqb73@example.com</span>
                                </div>
                            </div>

                            <div
                                className={cx('grid-column-4', {
                                    'item-footer': true,
                                })}
                            >
                                <Heading className={cx('title')} h4>
                                    Địa chỉ
                                </Heading>
                                <div className={cx('contact')}>
                                    <IconMapPin size={30} />
                                    <span>2715 Ash Dr. San Jose, South Dakota 83475</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('grid-row', { 'content-last': 'content-last' })}>
                    <div className={cx('grid-column-12', { 'group-license': 'group-license' })}>
                        <div className={cx('Donors')}>
                            <span>2024 | Nền tảng học STEM hàng đầu Việt Nam</span>
                        </div>
                        <div className={cx('foundation')}>
                            <a className={cx('link')} href={config.routes.home}>
                                <IconBrandFacebook size={18} className={cx('icon')} />
                            </a>
                            <a className={cx('link')} href={config.routes.home}>
                                <IconBrandX size={18} className={cx('icon')} />
                            </a>
                            <a className={cx('link')} href={config.routes.home}>
                                <IconBrandTiktok size={18} className={cx('icon')} />
                            </a>
                            <a className={cx('link')} href={config.routes.home}>
                                <IconBrandInstagram size={18} className={cx('icon')} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
