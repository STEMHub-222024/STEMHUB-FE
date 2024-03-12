import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './NavbarTopic.module.scss';
import { Menu } from '~/components/Layouts/Components/Menu';
import Button from '~/components/Common/Button';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { selectNavbarTopic } from '~/app/selectors';
import { getOutstanding } from '~/app/slices/topicSlice';
import { handleOnClickStem } from '../../../../app/slices/navbarTopicSlice';

const cx = classNames.bind(styles);

function NavbarTopic({ checkStemDefault }) {
    const dispatch = useDispatch();
    const { navbarTopicData } = useSelector(selectNavbarTopic);

    const fetchApi = async (stemId) => {
        try {
            await dispatch(
                getOutstanding({
                    stemId,
                }),
            ).unwrap();
        } catch (rejectedValueOrSerializedError) {
            console.error(rejectedValueOrSerializedError);
        }
    };

    function handleTopiShow(e, stemId, stemName) {
        const actives = document.getElementsByClassName(cx('active'));

        for (const element of actives) {
            element.classList.remove(cx('active'));
        }
        if (e.target.closest('.know')) {
            fetchApi(stemId);
            dispatch(
                handleOnClickStem({
                    stemName,
                }),
            );
            e.target.parentNode.classList.add(cx('active'));
        } else {
            fetchApi(stemId);
            dispatch(
                handleOnClickStem({
                    stemName,
                }),
            );
            e.target.classList.add(cx('active'));
        }
    }

    return (
        <Menu className={cx('menu-topic')}>
            <div className={cx('group-menu')}>
                {navbarTopicData?.map((stem) => {
                    const activeDefault = checkStemDefault(stem?.stemName, 'STEM10');
                    return (
                        <div key={stem?.stemId}>
                            <Button
                                className={cx('btnStem', { active: activeDefault?.stemDefault })}
                                text
                                mediumSmall
                                know
                                onClick={(e) => handleTopiShow(e, stem?.stemId, stem?.stemName)}
                            >
                                {activeDefault?.upperCaseName}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </Menu>
    );
}

NavbarTopic.propTypes = {
    checkStemDefault: PropTypes.func,
};

export default NavbarTopic;
