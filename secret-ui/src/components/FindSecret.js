import React, { useState } from 'react'
import { Form, Input, Button, Col, Row, Typography, notification, Spin } from 'antd';
import { getSecret } from '../service/SecretService';
import { MemoizedResultModal as ResultModal } from './ResultModal';
const { Title } = Typography;
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
};
const openNotification = (data) => {
    notification.open({
        message: data.title,
        description: data.content,
        onClick: () => {
        },
    });
};

function AddSecret() {
    const [modalData, setModalData] = useState({
        showModal: false,
        modalContent: {}
    })
    const {showModal, modalContent} = modalData;
    const [form] = Form.useForm();
    const [spin, setSpin] = useState(false);

    async function reqData(val) {
        try {
            const res = await getSecret(val.hash);
            setSpin(false)
            if (res.status === 200) {
                form.resetFields();
                setModalData({ showModal: true, modalContent: res.data });
            }
            else {
                const errorMessage = res.data?.data ? res.data.data.map((val) => `${val.param}: ${val.msg}`) : '';
                openNotification({ title: res.data.message, content: errorMessage });
            }
        } catch (err) {
            openNotification({ title: err, content: '' });
        }
    }

    const onFinish = (values) => {
        setSpin(true)
        reqData(values);
    };

    return (
        <>
            <Row>
                <Col xl={{ span: 24 }} className="cl-full">
                    <Title>Find a secret</Title>
                </Col>
                <Col xl={{ span: 24 }} className='cl-full plr-20'>
                    <Form form={form} layout="vertical" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                        <Form.Item name="hash" label="Input Secret Hash" rules={[{ required: true }]}>
                            <Input placeholder="Input Secret Hash" />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <ResultModal show={showModal} content={modalContent} />
            <Spin spinning={spin}/>
        </>

    )
}

export default AddSecret