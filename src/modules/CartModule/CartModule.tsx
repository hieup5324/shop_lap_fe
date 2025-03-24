import { Button, Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import { formatPriceVND } from '@/src/utils/format-price'
import { Col, Modal, Row, Select, Spin, Table, Tag, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/router'

interface DataType {
  id: number
  name: string
  quantity: number
  total: number
}

const CartModule: React.FC = () => {
  // State
  const [records, setRecords] = useState<DataType[]>([])
  const [totalCost, setTotalCost] = useState<number>(0)
  const [productsInCart, setProductsInCart] = useState<any[]>([])
  const [isCallingApi, setIsCallingApi] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [transId, setTransId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsCallingApi(true)
        const response: any = await mainAxios.get('http://localhost:3001/cart')

        if (response?.items) {
          setProductsInCart(response.items)
        } else {
          setProductsInCart([])
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy giỏ hàng:', error)
        message.error('Không thể tải giỏ hàng!')
        setProductsInCart([])
      } finally {
        setIsCallingApi(false)
      }
    }

    fetchCartItems()
  }, [])

  useEffect(() => {
    if (!Array.isArray(productsInCart) || productsInCart.length === 0) {
      setRecords([])
      setTotalCost(0)
      return
    }

    const mappedRecords: DataType[] = productsInCart.map(
      (item: any, index: number) => ({
        id: item.productId,
        key: index + 1,
        name: item.productName,
        quantity: item.quantity,
        total: item.price * item.quantity
      })
    )

    setRecords(mappedRecords)

    const total = productsInCart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    )

    setTotalCost(total)
  }, [productsInCart])

  const handleDeleteItem = async (record: DataType) => {
    try {
      await mainAxios.delete(`http://localhost:3001/cart/${record.id}`)

      const updatedCart = productsInCart.filter(
        item => item.productId !== record.id
      )
      setProductsInCart(updatedCart)

      message.success('Xóa sản phẩm khỏi giỏ hàng thành công!')
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error)
      message.error('Không thể xóa sản phẩm!')
    }
  }

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      message.warning('Số lượng phải lớn hơn 0!')
      return
    }

    try {
      await mainAxios.patch('http://localhost:3001/cart', {
        productId,
        quantity: newQuantity
      })

      const updatedCart = productsInCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
      setProductsInCart(updatedCart)

      message.success('Cập nhật số lượng thành công!')
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error)
      message.error('Không thể cập nhật số lượng!')
    }
  }

  const handleOrder = async () => {
    if (productsInCart.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống!')
      return
    }

    setIsOrdering(true)

    try {
      const response: any = await mainAxios.post(
        'http://localhost:3001/order',
        {
          payment_type: paymentMethod
        }
      )

      setTransId(response.id)

      if (paymentMethod === 'vnpay' && response?.vnpay_url) {
        setProductsInCart([])
        window.location.href = response?.vnpay_url
      } else {
        setProductsInCart([])
        message.success('Đặt hàng thành công!')
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error)
      message.error('Không thể đặt hàng!')
    } finally {
      setIsOrdering(false)
    }
  }

  const handleViewProduct = async (productId: number) => {
    try {
      setIsCallingApi(true)
      const response = await mainAxios.get(
        `http://localhost:3001/products/${productId}`
      )
      setSelectedProduct(response)
      setIsProductModalOpen(true)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error)
      message.error('Không thể lấy thông tin sản phẩm!')
    } finally {
      setIsCallingApi(false)
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (_, record, index) => <Title level={5} text={`${index + 1}`} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render: (_, record) => <Title level={5} text={record.name} />
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      render: (_, record) => (
        <Row align="middle" justify="center" className="flex items-center">
          <Button
            text="-"
            type="default"
            onClick={() => handleUpdateQuantity(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
            className="mr-2"
          />
          <div className="w-[40px] text-center text-lg font-semibold">
            {record.quantity}
          </div>
          <Button
            text="+"
            type="default"
            onClick={() => handleUpdateQuantity(record.id, record.quantity + 1)}
            className="ml-2"
          />
        </Row>
      )
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: (_, record) => (
        <Title
          level={5}
          className="text-primary"
          text={`${formatPriceVND(record.total)} VNĐ`}
        />
      )
    },
    {
      title: 'Xem chi tiết',
      align: 'center',
      render: (_, record) => (
        <Button
          type="default"
          text="Xem"
          onClick={() => handleViewProduct(record.id)}
        />
      )
    },
    {
      title: 'Xóa',
      align: 'center',
      render: (_, record) => (
        <div
          onClick={() => handleDeleteItem(record)}
          className="flex cursor-pointer items-center justify-center transition-all hover:text-red-500"
        >
          <Trash2 size={20} className="mr-2 text-gray-600 hover:text-red-500" />
          <span className="font-medium text-gray-600 hover:text-red-500">
            Xóa
          </span>
        </div>
      )
    }
  ]

  return (
    <div className="rounded-lg bg-white p-6">
      <Title level={3} text="Giỏ hàng của bạn" className="mb-4" />

      <Table columns={columns} dataSource={records || []} pagination={false} />

      <Row justify="end" className="mt-5" gutter={10}>
        <Col>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: 200, marginTop: 4 }}
            className="rounded-lg border border-gray-300 shadow-sm"
            options={[
              { label: 'Tiền mặt', value: 'cash' },
              { label: 'VNPay', value: 'vnpay' },
              { label: 'MoMo', value: 'momo' },
              { label: 'ZaloPay', value: 'zalopay' }
            ]}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            text="Đặt hàng"
            onClick={handleOrder}
          />
        </Col>
      </Row>

      {/* ✅ Modal hiển thị chi tiết sản phẩm */}
      <Modal
        title="Thông tin sản phẩm"
        open={isProductModalOpen}
        onCancel={() => setIsProductModalOpen(false)}
        footer={null}
      >
        {selectedProduct ? (
          <div>
            <img
              src={selectedProduct.photo_url}
              alt={selectedProduct.product_name}
              className="mb-4 h-64 w-full rounded-lg object-cover"
            />
            <Title level={4} text={selectedProduct.product_name} />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <Title
              level={5}
              className="mt-2 text-primary"
              text={`Giá: ${formatPriceVND(selectedProduct.price)} VNĐ`}
            />
          </div>
        ) : (
          <Spin />
        )}
      </Modal>
    </div>
  )
}

export default CartModule
