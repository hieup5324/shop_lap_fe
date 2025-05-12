import { Row, Col, Card, Typography } from 'antd';
import Chat from '@/src/modules/ChatModule/Chat';

const { Title } = Typography;

const Support = () => {
  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={3}>Hỗ trợ khách hàng</Title>
            <p className="text-gray-600 mb-4">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy gửi tin nhắn cho chúng tôi nếu bạn cần giúp đỡ.
            </p>
          </Card>
        </Col>
        <Col span={24}>
          <Chat />
        </Col>
      </Row>
    </div>
  );
};

export default Support; 