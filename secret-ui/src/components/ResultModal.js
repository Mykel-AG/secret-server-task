import React, { useEffect, useState } from 'react';
import { Modal, Result, Row, Col, Typography, Divider } from 'antd';
import { DateTime } from 'luxon';
const { Paragraph } = Typography;
const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);


function ResultModal(props) {
    const modalContent = props?.content ? props.content : {};


    const data = {
        show: props?.show ? props?.show : false,
        title: modalContent.message ? modalContent.message : '',
        hash: modalContent.data?.hash ? modalContent.data.hash : '',
        createdAt: modalContent.data?.createdAt ? formatDate(modalContent.data?.createdAt) : '',
        expiresAt: modalContent.data?.expiresAt ? formatDate(modalContent.data.expiresAt) : 'Never',
        secretText: modalContent.data?.secretText ? modalContent.data.secretText : '',
    };

    const [visible, setVisible] = useState(data.show);
    
    function formatDate(date){
        const value = DateTime
        .fromISO(date)
        .toFormat('MM/dd/yyyy h:mm:ss a');

        return value
    }

    useEffect(() => {
        setVisible(props.show);
    }, [props])
    return (
        <>
            <Modal
                title="Secret Details"
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1000}
                footer={null}
                keyboard={false}
                maskClosable={false}
            >
                <Result
                    key={data.hash}
                    status="success"
                    title={data.title}
                    extra={[
                        <Divider/>,
                        <p className="site-description-item-profile-p">
                            Secret Hash (To be used to retrieve secret)
                        </p>,
                        <Paragraph copyable>{data.hash}</Paragraph>,
                        <Row className='mb-20'>
                            <Col span={12}>
                                <DescriptionItem title="Created at" content={data.createdAt} />
                            </Col>
                            <Col span={12}>
                                <DescriptionItem title="Expires after" content={data.expiresAt} />
                            </Col>
                        </Row>,
                        <Row className='mb-40'>
                            <Col span={24}>
                                <DescriptionItem
                                    title="Secret"
                                    content={data.secretText}
                                />
                            </Col>
                        </Row>
                    ]}
                />
            </Modal>
        </>
    )
}

export default ResultModal