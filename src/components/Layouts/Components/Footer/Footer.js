import classNames from 'classnames/bind';
import { useLayoutEffect, useState, useMemo } from 'react';
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
import SocialLink from './SocialLink';
import config from '~/config';
import * as ownerServices from '~/services/ownerServices';

const cx = classNames.bind(styles);

function Footer() {
    const [owner, setOwner] = useState(null);

    useLayoutEffect(() => {
        const fetchApi = async () => {
            const response = await ownerServices.getOwner();
            if (response?.length > 0) {
                setOwner(response[response.length - 1]);
            }
        };

        fetchApi();
    }, []);

    const socialLinks = useMemo(
        () => [
            { icon: IconBrandFacebook, href: config.routes.home },
            { icon: IconBrandX, href: config.routes.home },
            { icon: IconBrandTiktok, href: config.routes.home },
            { icon: IconBrandInstagram, href: config.routes.home },
        ],
        [],
    );
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

                        <p className={cx('content')}>{owner?.introduction}</p>
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
                                    <span>{owner?.phone}</span>
                                </div>
                                <div className={cx('contact')}>
                                    <IconMail size={20} />
                                    <span>{owner?.gmail}</span>
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
                                    <span>{owner?.address}</span>
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
                            {socialLinks.map((link, index) => (
                                <SocialLink key={index} Icon={link.icon} href={link.href} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
