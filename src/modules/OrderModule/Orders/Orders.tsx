import { Button, Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import { formatPriceVND } from '@/src/utils/format-price'
import {
  Col,
  Row,
  Spin,
  Table,
  Tag,
  message,
  Modal,
  List,
  Avatar,
  Divider
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface OrderType {
  id: number
  total_price: number
  order_code: string
  status: string
  payment_type: string
  createdAt: string
  orderItems: {
    product_name: string
    total_price: number
    quantity: number
    price: number
    photo_url: string // Thêm field ảnh sản phẩm
  }[]
}

const Order: React.FC = () => {
  const router = useRouter()

  // State
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response: any = await mainAxios.get('http://localhost:3001/order')
        console.log('Danh sách đơn hàng:', response)
        setOrders(response || [])
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
        message.error('Không thể tải danh sách đơn hàng!')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleViewOrder = (order: OrderType) => {
    setSelectedOrder(order)
    setIsModalVisible(true) // Hiển thị popup
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedOrder(null)
  }

  const columns: ColumnsType<OrderType> = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (_, record, index) => <Title level={5} text={`${index + 1}`} />
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      render: (_, record) => (
        <Title
          level={5}
          text={new Date(record.createdAt).toLocaleDateString()}
        />
      )
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_code',
      render: (_, record) => <Title level={5} text={`${record.order_code}`} />
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.total_price)} VNĐ`} />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => {
        const color = record.status === 'PENDING' ? 'orange' : 'green'
        return <Tag color={color}>{record.status}</Tag>
      }
    },
    {
      title: 'Phương Thức Thanh toán',
      dataIndex: 'payment_type',
      render: (_, record) => <Title level={5} text={record.payment_type} />
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Button
          type="default"
          text="Xem chi tiết"
          onClick={() => handleViewOrder(record)}
        />
      )
    }
  ]

  return (
    <div className="rounded-lg bg-white p-6">
      <Title level={3} text="Danh sách đơn hàng" className="mb-4" />

      {loading ? (
        <Row justify="center" className="mt-6">
          <Spin />
        </Row>
      ) : orders.length > 0 ? (
        <Table columns={columns} dataSource={orders} pagination={false} />
      ) : (
        <Title
          level={4}
          text="Bạn chưa có đơn hàng nào!"
          className="text-center"
        />
      )}

      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.order_code}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <List
            itemLayout="vertical"
            dataSource={selectedOrder.orderItems}
            renderItem={(item, index) => (
              <div className="mb-4 rounded-lg border bg-gray-50 p-4">
                <Row align="middle" gutter={[16, 16]}>
                  <Col span={6}>
                    <Avatar
                      src={item.photo_url}
                      shape="square"
                      size={100}
                      className="rounded-lg shadow-lg"
                    />
                  </Col>
                  <Col span={18}>
                    <Title level={3} text={`${item.product_name}`} />
                    <p className="text-lg font-semibold">
                      Giá: {formatPriceVND(item.price)} VNĐ
                    </p>
                    <p className="text-lg">Số lượng: {item.quantity}</p>
                    <p className="text-lg font-semibold text-red-500">
                      Thành tiền: {formatPriceVND(item.total_price)} VNĐ
                    </p>
                  </Col>
                </Row>
              </div>
            )}
          />
        )}
      </Modal>
    </div>
  )
}

export default Order
