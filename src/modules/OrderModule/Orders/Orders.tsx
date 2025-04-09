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
  Pagination,
  Input
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import {
  convertOrderStatus,
  convertPaymentStatus,
  getPaymentMethodLabel,
  getStatusColor
} from '@/src/constant/constant'

enum PaymentMethod {
  vnpay = 'VNPAY',
  cash = 'Tiền mặt'
}

interface OrderType {
  id: number
  total_price: number
  order_code: string
  status: string
  payment_type: PaymentMethod
  createdAt: string
  status_payment: string
  receiver_address: string
  receiver_name: string
  receiver_phone: string
  fee_transport: number
  orderItems: {
    product_name: string
    total_price: number
    quantity: number
    price: number
    photo_url: string
  }[]
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [page, setPage] = useState<number>(1)
  const pageSize = 6
  const [total, setTotal] = useState<number>(0)

  const [searchKey, setSearchKey] = useState<string>('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:3001/order/test?page=${page}&page_size=${pageSize}`
      if (searchKey.trim()) {
        url += `&search=${searchKey.trim()}`
      }

      const response: any = await mainAxios.get(url)
      setOrders(response.data || [])
      setTotal(response.paging?.total || 0)
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
      message.error('Không thể tải danh sách đơn hàng!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const handleViewOrder = (order: OrderType) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedOrder(null)
  }

  const columns: ColumnsType<OrderType> = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (_, __, index) => (
        <Title level={5} text={`${(page - 1) * pageSize + index + 1}`} />
      )
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
      render: (_, record) => <Title level={5} text={record.order_code} />
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.total_price)} VNĐ`} />
      )
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      render: (_, record) => (
        <Title level={5} text={convertOrderStatus(record.status)} />
      )
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment_type',
      render: (_, record) => (
        <Title level={5} text={getPaymentMethodLabel(record.payment_type)} />
      )
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'status_payment',
      render: (_, record) => (
        <Title level={5} text={convertPaymentStatus(record.status_payment)} />
      )
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
      <Row justify="space-between" align="middle" className="mb-4">
        <Title level={3} text="Danh sách đơn hàng" />

        <Row gutter={16}>
          <Col>
            <Input
              placeholder="Nhập mã đơn hàng..."
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              className="min-w-[250px]"
            />
          </Col>
          <Col>
            <Button text="Tìm kiếm" type="primary" onClick={handleSearch} />
          </Col>
        </Row>
      </Row>

      {loading ? (
        <Row justify="center" className="mt-6">
          <Spin />
        </Row>
      ) : orders.length > 0 ? (
        <>
          <Table columns={columns} dataSource={orders} pagination={false} />
          <Row justify="center" className="mt-4">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={newPage => setPage(newPage)}
              showSizeChanger={false}
            />
          </Row>
        </>
      ) : (
        <Title
          level={4}
          text="Không tìm thấy đơn hàng nào!"
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
          <>
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
                      <Title level={3} text={item.product_name} />
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

            <div className="mb-4 rounded-md bg-gray-100 p-4">
              <p className="mb-1 text-lg font-semibold">Địa chỉ người nhận:</p>
              <p className="text-base text-gray-700">
                Họ tên : {selectedOrder.receiver_name}
              </p>
              <p className="text-base text-gray-700">
                SĐT : {selectedOrder.receiver_phone}
              </p>
              <p className="text-base text-gray-700">
                Địa chỉ : {selectedOrder.receiver_address}
              </p>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Order
