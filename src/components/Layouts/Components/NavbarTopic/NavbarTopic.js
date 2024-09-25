import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './NavbarTopic.module.scss';
import { Menu } from '~/components/Layouts/Components/Menu';
import Button from '~/components/Common/Button';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { selectNavbarTopic } from '~/app/selectors';
import { getOutstanding } from '~/app/slices/topicSlice';
import { handleOnClickStem } from '~/app/slices/navbarTopicSlice';

const cx = classNames.bind(styles);

function NavbarTopic({ checkStemDefault }) {
    const dispatch = useDispatch();
    const { navbarTopicData } = useSelector(selectNavbarTopic);

    const fetchApi = async (stemId) => {
        try {
            await dispatch(
                getOutstanding({
                    stemId,
                })
            ).unwrap();
        } catch (error) {  
        }
    };

    const handleTopiShow = (e, stemId, stemName) => {
        const actives = document.getElementsByClassName(cx('active'));
        for (const element of actives) {
            element.classList.remove(cx('active'));
        }

        fetchApi(stemId);
        dispatch(
            handleOnClickStem({
                stemName,
            })
        );

        if (e.target.closest('.know')) {
            e.target.parentNode.classList.add(cx('active'));
        } else {
            e.target.classList.add(cx('active'));
        }
    };

    return (
        <Menu className={cx('menu-topic')}>
            <div className={cx('group-menu')}>
                {navbarTopicData?.map((stem) => {
                    const activeDefault = checkStemDefault(stem?.stemName, 'stem10');
                    return (
                        <div key={stem?.stemId}>
                            <Button
                                className={cx('btnStem', { active: activeDefault?.isDefaultMatch })}
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
    checkStemDefault: PropTypes.func.isRequired, 
};

export default NavbarTopic;
