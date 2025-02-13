import { Button, Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import PATH from '@/src/shared/path'
import { formatPriceVND } from '@/src/utils/format-price'
import { Col, Row, Spin, Table, message, InputNumber } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DataType {
  id: number
  name: string
  quantity: number
  total: number
}

const CartModule: React.FC = () => {
  const router = useRouter()

  // State
  const [records, setRecords] = useState<DataType[]>([])
  const [totalCost, setTotalCost] = useState<number>(0)
  const [productsInCart, setProductsInCart] = useState<any[]>([])
  const [isCallingApi, setIsCallingApi] = useState(false)

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
        key: index + 1, // ✅ STT
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
      title: 'Thao tác',
      align: 'center', // ✅ Căn giữa nội dung
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

      {isCallingApi ? (
        <Row justify="center" className="mt-6">
          <Spin />
        </Row>
      ) : productsInCart && productsInCart.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={records || []}
            pagination={false}
          />

          <Row justify="end" className="mt-6">
            <Title
              level={4}
              text={`Tổng tiền: ${formatPriceVND(totalCost)} VNĐ`}
            />
          </Row>
        </>
      ) : (
        <Title
          level={4}
          text="Giỏ hàng của bạn đang trống!"
          className="text-center"
        />
      )}
    </div>
  )
}

export default CartModule
