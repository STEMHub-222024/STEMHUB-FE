import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './NavbarTopic.module.scss';
import { Menu } from '~/components/Layouts/Components/Menu';
import Button from '~/components/Common/Button';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { getStemAsync } from './navbarTopicSlice';
import { selectNavbarTopic, selectTopic } from '~/app/selectors';
import { updateOutstanding, getOutstanding } from '~/components/Layouts/Components/Topic/topicSlice';

//huỷ fetch
const controller = new AbortController();

const cx = classNames.bind(styles);

function NavbarTopic() {
    const dispatch = useDispatch();
    const { navbarTopicData } = useSelector(selectNavbarTopic);
    const { data } = useSelector(selectTopic);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dispatch(getStemAsync()).unwrap();
                const defaultStem = result.find((stem) => {
                    const activeDefault = checkStemDefault(stem?.stemName, 'STEM10');
                    return activeDefault?.stemDefault;
                });

                if (defaultStem) {
                    handleUpdateOutstanding(defaultStem?.stemId);
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
            }
        };

        fetchApi();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    function handleTopiShow(e, stemId) {
        const actives = document.getElementsByClassName(cx('active'));

        for (const element of actives) {
            element.classList.remove(cx('active'));
        }
        if (e.target.closest('.know')) {
            handleUpdateOutstanding(stemId);
            e.target.parentNode.classList.add(cx('active'));
        } else {
            handleUpdateOutstanding(stemId);
            e.target.classList.add(cx('active'));
        }
    }

    const handleUpdateOutstanding = (stemId) => {
        dispatch(
            updateOutstanding({
                stemId: stemId,
            }),
        );
    };

    const checkStemDefault = (stemName, defaultValue) => {
        const upperCaseName = stemName.toUpperCase();
        const stemDefault = upperCaseName.includes(defaultValue);
        if (stemDefault) {
            return {
                upperCaseName,
                stemDefault,
            };
        } else {
            return {
                upperCaseName,
            };
        }
    };

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
                                onClick={(e) => handleTopiShow(e, stem?.stemId)}
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

export default NavbarTopic;
