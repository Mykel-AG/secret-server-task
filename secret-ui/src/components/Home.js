import React from 'react'
import { Card, Row, Col, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;

function Home({ handlePageChange }) {
    return (

        <>
            <Row>
                <Col xl={{ span: 24 }} className="cl-full">
                    <Title>Welcome to Secrets Page</Title>
                    <Title level={5}>What would you like to do?</Title>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xl={{ span: 12 }} className='cl-full mb-30'>
                    <Card title="Add secret" hoverable={true}>
                        <p>Add a secret, set the expiry and get a unique hash for retrieving it.</p>
                        <Link onClick={() => handlePageChange(2)} to={"/add"} className="nav-link">
                            <Button type="primary" key="console">
                                Continue
                            </Button>
                        </Link>
                    </Card>
                </Col>
                <Col xl={{ span: 12 }} className='cl-full mb-30'>
                    <Card title="Find Secret" hoverable={true}>
                        <p>Retrieve secret using unique hash.</p>
                        <Link onClick={() => handlePageChange(3)} to={"/find"} className="nav-link">
                            <Button shape="round" type="success" key="console">
                                Continue
                            </Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Home