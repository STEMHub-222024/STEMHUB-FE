import { useMemo, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Introduce.module.scss';
import Button from '~/components/Common/Button';
import ScientistImage from './ScientistImage';
import useScientistData from '~/hooks/useScientistData';

const cx = classNames.bind(styles);

function Introduce() {
    const { scientists, setScientists, selectedScientist, setSelectedScientist, mainIndex } = useScientistData();

    const handleScientistClick = useCallback(
        (index) => {
            setScientists((prevScientists) => {
                const newScientists = [...prevScientists];
                [newScientists[mainIndex], newScientists[index]] = [newScientists[index], newScientists[mainIndex]];
                return newScientists;
            });
            setSelectedScientist(scientists[index]);
        },
        [mainIndex, scientists, setScientists, setSelectedScientist],
    );

    const lastFiveScientists = useMemo(() => scientists.slice(-5), [scientists]);


    return (
        <>
            <div className={cx('grid-column-5')}>
                <div className={cx('wrap-avatar')}>
                    <div className={cx('group-background-left')}>
                        <div className={cx('background-top-left')}>
                            <ScientistImage
                                scientist={lastFiveScientists[0]}
                                index={0}
                                onClick={() => handleScientistClick(0)}
                                isMain={false}
                            />
                        </div>
                        <div className={cx('background-bottom-left')}>
                            <ScientistImage
                                scientist={lastFiveScientists[1]}
                                index={1}
                                onClick={() => handleScientistClick(1)}
                                isMain={false}
                            />
                        </div>
                    </div>
                    <div className={cx('background-main')}>
                        <ScientistImage scientist={lastFiveScientists[2]} index={2} isMain={true} />
                    </div>
                    <div className={cx('group-background-right')}>
                        <div className={cx('background-top-right')}>
                            <ScientistImage
                                scientist={lastFiveScientists[3]}
                                index={3}
                                onClick={() => handleScientistClick(3)}
                                isMain={false}
                            />
                        </div>
                        <div className={cx('background-bottom-right')}>
                            <ScientistImage
                                scientist={lastFiveScientists[4]}
                                index={4}
                                onClick={() => handleScientistClick(4)}
                                isMain={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('grid-column-7')}>
                <div className={cx('wrap-content')}>
                    <div className={cx('criteria')}>
                        <div className={cx('criteria-item')}>
                            <span className={cx("criteria-item-italicized")}>{selectedScientist ? selectedScientist.adage : ''}</span>
                            <span>{selectedScientist ? selectedScientist.adageVN : ''}</span>
                            <span className={cx("end-criteria", {
                              "criteria-item-italicized": true
                            })}>{selectedScientist ? selectedScientist.fullName : ''}</span>
                        </div>
                    </div>
                    <div className={cx('container')}>
                        <p className={cx('context')}>
                            {selectedScientist ? selectedScientist.descriptionScientist : ''}
                        </p>
                    </div>
                    <div className={cx('action')}>
                        <Button
                            className={cx('btn-title')}
                            mainColor
                            small
                            to={`/scientist/${selectedScientist ? selectedScientist.scientistId : ''}`}
                        >
                            Xem thêm
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Introduce;
