import { Title } from '@/src/components';
import { CheckOutlined, HomeOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

const Reputation = () => {
	return (
		<Col span={9}>
			<div className="rounded-md border border-solid border-gray-400 p-4">
				<div className="mb-4">
					<Title
						level={4}
						className="text-center text-primary"
						text={`YÊN TÂM MUA SẮM TẠI LAPTOP SHOP`}
					/>
				</div>

				<Row gutter={8} align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<CheckOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} text={`Chất lượng sản phẩm là hàng đầu`} />
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<CheckOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} text={`Dùng test máy 15 ngày đầu lỗi 1 đổi 1`} />
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<CheckOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} text={`Hỗ trợ và hậu mãi sau bán hàng tốt nhất`} />
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<CheckOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} text={`Trả góp lãi suất 0% qua thẻ visa`} />
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<CheckOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} text={`Giao hàng miễn phí toàn quốc nhanh nhất`} />
					</Col>
				</Row>
			</div>

			<div className="mt-4 rounded-md border border-solid border-gray-400 p-4">
				<Row gutter={8} align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<HomeOutlined />
						</Row>
					</Col>

					<Col>
						<Title
							level={5}
							className="font-normal"
							text={`Số 10 ngõ 282 Kim Giang, Hoàng Mai, Hà Nội`}
						/>
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<PhoneOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} className="font-normal" text={`0825.233.233`} />
					</Col>
				</Row>

				<Row gutter={8} className="mt-2" align={'middle'}>
					<Col>
						<Row align={'middle'}>
							<MessageOutlined />
						</Row>
					</Col>

					<Col>
						<Title level={5} className="font-normal" text={`hotrolaptopshop@gmail.com`} />
					</Col>
				</Row>
			</div>
		</Col>
	);
};

export default Reputation;
