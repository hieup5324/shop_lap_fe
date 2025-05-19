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
  Input,
  Select,
  DatePicker
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import {
  convertGhnStatus,
  convertOrderStatus,
  convertPaymentStatus,
  getPaymentMethodLabel,
  getStatusColor
} from '@/src/constant/constant'
import axios from 'axios'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { useLoading } from '@/src/hooks/useLoading'
import dayjs from 'dayjs'

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
  order_code_transport: string
  orderItems: {
    product_name: string
    total_price: number
    quantity: number
    price: number
    photo_url: string
  }[]
  ghn_status?: string // Thêm trường để chứa thông tin status từ GHN
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([])
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [ghnStatus, setGhnStatus] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<string>('')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const pageSize = 6
  const [total, setTotal] = useState<number>(0)

  const [searchKey, setSearchKey] = useState<string>('')

  const fetchOrders = async () => {
    startLoading()
    try {
      let url = `http://localhost:3001/order/test?page=${page}&page_size=${pageSize}`
      if (searchKey.trim()) {
        url += `&search=${searchKey.trim()}`
      }
      if (paymentStatus) {
        url += `&payment_status=${paymentStatus}`
      }
      if (fromDate || toDate) {
        if (fromDate) {
          url += `&from_date=${fromDate}`
        }
        if (toDate) {
          url += `&to_date=${toDate}`
        }
      }

      const response: any = await mainAxios.get(url)
      setOrders(response.data || [])
      setTotal(response.paging?.total || 0)
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
      message.error('Không thể tải danh sách đơn hàng!')
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, paymentStatus, fromDate, toDate])

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const handleViewOrder = async (order: OrderType) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
    startLoading()

    try {
      const response: any = await mainAxios.post(
        'http://localhost:3001/ghn/tracking_order',
        {
          order_code: order.order_code_transport
        },
        {
          headers: {
            Token: process.env.GHN_TOKEN
          }
        }
      )

      if (response?.data) {
        setGhnStatus(response.data.status)
      }
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái đơn hàng từ GHN:', error)
      message.error('Không thể lấy trạng thái đơn hàng từ GHN!')
    } finally {
      stopLoading()
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedOrder(null)
    setGhnStatus('')
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
        <Title level={5} text={dayjs(record.createdAt).format('DD/MM/YYYY')} />
      )
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_code',
      render: (_, record) => <Title level={5} text={record.order_code} />
    },
    {
      title: 'Mã đơn vị vận chuyển',
      dataIndex: 'order_code',
      render: (_, record) => (
        <Title
          level={5}
          text={
            record.order_code_transport ? record.order_code_transport : '---'
          }
        />
      )
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'status',
      render: (_, record) => (
        <Title
          level={5}
          text={
            record.fee_transport
              ? `${formatPriceVND(record.fee_transport)} VNĐ`
              : '---'
          }
        />
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.total_price)} VNĐ`} />
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
      {isLoading && <LoadingSpinner />}
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Row align="middle" gutter={16}>
            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <Title
                    level={5}
                    text="Trạng thái thanh toán:"
                    className="mb-0"
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="Chọn trạng thái"
                    style={{ width: 170 }}
                    value={paymentStatus}
                    onChange={value => {
                      setPaymentStatus(value)
                      setPage(1)
                    }}
                    options={[
                      { label: 'Tất cả', value: '' },
                      { label: 'Chưa thanh toán', value: 'pending' },
                      { label: 'Thanh toán thất bại', value: 'failed' },
                      { label: 'Đã thanh toán', value: 'success' }
                    ]}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <Title level={5} text="Lọc từ ngày:" className="mb-0" />
                </Col>
                <Col>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={date => {
                      setFromDate(date ? dayjs(date).format('YYYY-MM-DD') : '')
                      setPage(1)
                    }}
                    style={{ width: 130 }}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <Title level={5} text="Đến ngày:" className="mb-0" />
                </Col>
                <Col>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={date => {
                      setToDate(date ? dayjs(date).format('YYYY-MM-DD') : '')
                      setPage(1)
                    }}
                    style={{ width: 130 }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col>
          <Row gutter={16}>
            <Col>
              <Input
                placeholder="Nhập mã đơn hàng..."
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
                className="h-[32px] min-w-[250px]"
              />
            </Col>
            <Col>
              <Button text="Tìm kiếm" type="primary" onClick={handleSearch} />
            </Col>
          </Row>
        </Col>
      </Row>

      {orders.length > 0 ? (
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
            <div className="mb-4 rounded-md p-4">
              <p className="mb-1 inline-block text-lg font-semibold">
                Trạng thái đơn hàng:
              </p>
              <p className="ml-2 inline-block text-lg font-semibold text-green-500">
                {convertGhnStatus(ghnStatus)}
              </p>
            </div>

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
