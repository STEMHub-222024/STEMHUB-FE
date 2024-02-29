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
                    <div className={cx('grid-column-4')}>
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
                            <div className={cx('grid-column-4')}>
                                <Heading className={cx('title')} h4>
                                    Quick Links
                                </Heading>

                                <div className={cx('option-one')}>
                                    <a className={cx('link')} href={config.routes.home}>
                                        About
                                    </a>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Blog
                                    </a>
                                </div>
                                <div className={cx('option-tow')}>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Course
                                    </a>
                                    <a className={cx('link')} href={config.routes.home}>
                                        Contact
                                    </a>
                                </div>
                            </div>

                            <div className={cx('grid-column-4')}>
                                <Heading className={cx('title')} h4>
                                    Contact us
                                </Heading>
                                <div className={cx('contact')}>
                                    <IconPhone size={20} />
                                    <span>0816-788-646</span>
                                </div>
                                <div className={cx('contact')}>
                                    <IconMail size={20} />
                                    <span>michelle.rivera@example.com</span>
                                </div>
                            </div>

                            <div className={cx('grid-column-4')}>
                                <Heading className={cx('title')} h4>
                                    Address
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
                            <span>nvdqb73 2024 | All Rights Reserved</span>
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
