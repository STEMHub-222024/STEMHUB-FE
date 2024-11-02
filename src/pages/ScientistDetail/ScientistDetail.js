import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import Heading from '~/components/Common/Heading';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';
import * as ScientistServices from '~/services/scientistServices';

import styles from './ScientistDetail.module.scss';
const cx = classNames.bind(styles);

function ScientistDetail() {
    const { id } = useParams();
    const [scientist, setScientist] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            const response = await ScientistServices.getScientistId({ id });

            if (response) {
                setScientist(response);
            }
        };

        fetchApi();
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('gird', { fullWidth: true })}>
                <div className={cx('grid-row')}>
                    <div className={cx('grid-column-12', { repositoryWith: true })}>
                        <article>
                            <Heading className={cx('heading')}>
                                Tìm hiểu về nhà khoá học <span>{scientist ? scientist.fullName : ''}</span>
                            </Heading>
                            <div className={cx('shareButtons')}>
                                <FacebookShareButton url={window.location.href} quote={`Tìm hiểu về nhà khoá học ${scientist ? scientist.fullName : ''}`}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={window.location.href} title={`Tìm hiểu về nhà khoá học ${scientist ? scientist.fullName : ''}`}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <WhatsappShareButton url={window.location.href} title={`Tìm hiểu về nhà khoá học ${scientist ? scientist.fullName : ''}`}>
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                            </div>

                            <div className={cx('line')}></div>

                            <MarkdownParser content_C={scientist ? scientist.content : ''} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScientistDetail;
