import { Title } from '@/src/components'
import { HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'

const Footer: React.FC = () => {
  return (
    <div className="bg-white px-[90px] py-8">
      <Title
        text={`CÔNG TY CỔ PHẦN THƯƠNG MẠI MÁY TÍNH HOÀNG MINH`}
        level={4}
        className="mb-2"
      />

      <Typography>
        Giấy chứng nhận ĐKDN số 010894043873 do Sở Kế hoạch và Đầu tư Thành phố
        Hà Nội cấp ngày 11/10/2019
      </Typography>

      <Row gutter={8}>
        <Col>
          <Row className="h-full" align={'middle'}>
            <HomeOutlined />
          </Row>
        </Col>

        <Col>
          <Typography>
            Cơ sở tại Hà Nội: Km10, Đường Nguyễn Trãi, Q.Hà Đông, Hà Nội
          </Typography>
        </Col>
      </Row>

      <Row gutter={8} align={'middle'} className="mt-2">
        <Col>
          <Row align={'middle'}>
            <PhoneOutlined />
          </Row>
        </Col>

        <Col>
          <Typography>Điện thoại: 1900430323</Typography>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col>
          <Row className="h-full" align={'middle'}>
            <MailOutlined />
          </Row>
        </Col>

        <Col>
          <Typography>Email: laptopshop@pc.gmail.com</Typography>
        </Col>
      </Row>
    </div>
  )
}

export default Footer
