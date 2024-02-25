import classNames from 'classnames/bind';
import styles from './NavbarTopic.module.scss';
import { Menu } from '~/components/Layouts/Components/Menu';
import Button from '~/components/Common/Button';

const cx = classNames.bind(styles);

function NavbarTopic() {
    function handleTopiShow(e) {
        const actives = document.getElementsByClassName(cx('active'));

        for (const element of actives) {
            element.classList.remove(cx('active'));
        }
        if (e.target.closest('.know')) {
            e.target.parentNode.classList.add(cx('active'));
        } else {
            e.target.classList.add(cx('active'));
        }
    }

    return (
        <Menu className={cx('menu-topic')}>
            <div className={cx('group-menu')}>
                <Button className={cx('active')} text mediumSmall know onClick={handleTopiShow}>
                    STEM 10
                </Button>
                <Button text mediumSmall know onClick={handleTopiShow}>
                    STEM 11
                </Button>
                <Button text mediumSmall know onClick={handleTopiShow}>
                    STEM 12
                </Button>
            </div>
        </Menu>
    );
}

export default NavbarTopic;
