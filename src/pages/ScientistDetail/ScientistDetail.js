import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import { FacebookOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Flex, Tag } from 'antd';
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
                            <Flex gap="4px 0" wrap>
                                <Tag icon={<FacebookOutlined />} color="#3b5999">
                                    Facebook
                                </Tag>
                                <Tag icon={<YoutubeOutlined />} color="#cd201f">
                                    Youtube
                                </Tag>
                                <Tag icon={<TwitterOutlined />} color="#55acee">
                                    Twitter
                                </Tag>
                            </Flex>

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
