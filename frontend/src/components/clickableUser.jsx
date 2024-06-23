import React from 'react';
import { Card, Image, Container, Row, Col } from 'react-bootstrap';

const ClickableUser = ({ user, handleFunction }) => {
  return (
    <Card
      onClick={handleFunction}
      style={{
        cursor: 'pointer',
        backgroundColor: '#E8E8E8',
        width: '100%',
        marginBottom: '10px',
        borderRadius: '10px',
        padding: '10px'
      }}
      className="hoverable-card"
    >
      <Container>
        <Row className="align-items-center">
          <Col xs="auto">
            <Image
              roundedCircle
              src={user.profileURL}
              alt={user.name}
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
            />
          </Col>
          <Col>
            <h5 style={{ marginBottom: '0' }}>{user.name}</h5>
            <small>
              <b>Email:</b> {user.email}
            </small>
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default ClickableUser;
