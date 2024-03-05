import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconCameraUp } from '@tabler/icons-react';

import styles from './Profile.module.scss';
import Heading from '~/components/Common/Heading';
import images from '~/assets/images';
import Image from '~/components/Common/Image';
import Button from '~/components/Common/Button';
const cx = classNames.bind(styles);

function Profile() {
    const [firstName, setFirsName] = useState('Jonathan');
    const [lastName, setLastName] = useState('Doe');
    const handleFirsName = (e) => {
        setFirsName(e.target.value);
    };

    const handleLastName = (e) => {
        setLastName(e.target.value);
    };
    return (
        <div className={cx('wrapper')}>
            <Heading className={cx('heading')} h2>
                My Account
            </Heading>
            <div className={cx('group-avatar')}>
                <Image className={cx('avatar')} src={images.avatar_1} alt="avatar" />
                <button className={cx('icon')}>
                    <IconCameraUp size={18} />
                </button>
            </div>
            <div className={cx('info')}>
                <div className={cx('group-input')}>
                    <span className={cx('title')}>First Name</span>
                    <input type="text" name="firstName" value={firstName} onChange={handleFirsName} />
                </div>
                <div className={cx('group-input')}>
                    <span className={cx('title')}>Last Name</span>
                    <input type="text" name="lastName" value={lastName} onChange={handleLastName} />
                </div>
                <div className={cx('group-input')}>
                    <span className={cx('title')}>User Name</span>
                    <input type="text" name="userName" value="Jonathan" disabled />
                </div>
                <div className={cx('group-input')}>
                    <span className={cx('title')}>Email</span>
                    <input type="text" name="email" value="Jonathan" disabled />
                </div>
            </div>

            <Button className={cx('btn-save')} mainColor medium borderMedium>
                Save
            </Button>
        </div>
    );
}

Profile.propTypes = {};

export default Profile;
