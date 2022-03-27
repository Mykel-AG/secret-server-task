import { Form, Input, InputNumber, Button, Col, Row, Typography, notification, Spin } from 'antd';
import { useState } from 'react';
import { storeSecret } from '../services/SecretService';
import { MemoizedResultModal as ResultModal } from './ResultModal';
const { Title } = Typography;
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be greater than ${min}',
    },
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
    });
    const [spin, setSpin] = useState(false);
    const [form] = Form.useForm();

    async function postData(val) {
        const postData = {
            secret: val.text,
            expireAfter: val.expiry,
        };
        try {
            const res = await storeSecret(postData);
            setSpin(false)
            if (res.status === 200) {
                form.resetFields();
                setModalData({ showModal: true, modalContent: res.data })
            }
            else {
                const errorMessage = res.data?.data ? res.data.data.map((val) => `${val.param}: ${val.msg}`) : '';
                openNotification({ title: res.data.message, content: errorMessage.join(' | ') });
                
            }
        } catch (err) {
            openNotification({ title: err, content: ''})
        }
    }


    const onFinish = (values) => {
        setSpin(true)
        postData(values);
    };

    return (
        <>
            <Row>
                <Col xl={{ span: 24 }} className="cl-full">
                    <Title>Add a new secret</Title>
                </Col>
                <Col xl={{ span: 24 }} className='cl-full plr-20' >
                    <Form form={form} initialValues={{ "expiry": 0 }} layout="vertical" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                        <Form.Item name="text" label="Input Secret Text" rules={[{ required: true}]}>
                            <Input.TextArea placeholder="Input Secret Text" />
                        </Form.Item>
                        <Form.Item name="expiry" label="Input Expiry (Secs)" tooltip="0 means never expires" rules={[{ required: true, type: 'number', min: 0 }]}>
                            <InputNumber step="1" formatter={value => parseInt(value)} />
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <ResultModal show={modalData.showModal} content={modalData.modalContent} />
            <Spin spinning={spin}/>
        </>
    )
}

export default AddSecret