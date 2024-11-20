import { Button, Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import { useAppSelector } from '@/src/redux/hooks'
import { UserInfo } from '@/src/redux/slices/authSlice'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import PATH from '@/src/shared/path'
import { formatPriceVND } from '@/src/utils/format-price'
import {
  getLocalStorageItem,
  jsonParser,
  setLocalStorageItem
} from '@/src/utils/local-storage'
import { Col, Row, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface DataType {
  id: string
  deliveryFee: number
  quantity: number
  totalCost: number
  isPaid: number
  subTotal: number
}

const Orders: React.FC = () => {
  // useRouter
  const router = useRouter()

  // useState
  const [records, setRecords] = useState<DataType[]>()
  const [orders, setOrders] = useState<any[]>()
  const [userInfo, setUserInfo] = useState<UserInfo>()

  // useEffect
  useEffect(() => {
    const localUserInfo = getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO)
      ? jsonParser(getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO) as string)
      : {}

    setUserInfo(localUserInfo)
  }, [])

  useEffect(() => {
    if (!userInfo?.userId) return
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/carts?userId=${userInfo.userId}`
        )

        setOrders(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [userInfo?.userId])

  useEffect(() => {
    if (!orders) return

    const mappedRecords: DataType[] = orders.map((item: any) => {
      let calculatedTotalCost = 0

      item.productsInCard.map((product: any) => {
        calculatedTotalCost += product.price * product.amount
      })

      if (item?.deliverFee?.fee) {
        calculatedTotalCost += item?.deliverFee?.fee
      }

      return {
        id: item.cartId,
        deliveryFee: item.deliverFee.fee,
        quantity: item.productsInCard.length,
        totalCost: calculatedTotalCost,
        isPaid: item.isPaid,
        subTotal: calculatedTotalCost - item.deliverFee.fee
      }
    })

    setRecords(mappedRecords)
  }, [orders])

  // functions
  const handleDeleteItem = async (record: any) => {
    if (!record?.id) return

    try {
      await mainAxios.delete(`http://localhost:3004/carts/${record.id}`)

      router.reload()
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const handlePayment = async (record: DataType) => {
    try {
      const payload = {
        total: record.totalCost,
        details: {
          subtotal: record.subTotal,
          tax: 0.0,
          shipping: record.deliveryFee,
          handling_fee: 0.0,
          shipping_discount: 0.0,
          insurance: 0.0
        }
      }

      const res: any = await mainAxios.post(
        `http://localhost:3001/users/payment-url`,
        payload
      )

      setLocalStorageItem(
        LOCAL_STORAGE_KEY.PAYING_CART_ID,
        JSON.stringify(record.id)
      )

      if (res?.links?.[1]) {
        setLocalStorageItem(
          LOCAL_STORAGE_KEY.PAYMENT,
          JSON.stringify(res.links)
        )
        router.replace(res?.links?.[1].href)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // columns of table
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (_, record) => (
        <Link href={`${PATH.ORDERS}/${record?.id}` || `#`}>
          <Title level={5} text={record.id} className="hover:text-primary" />
        </Link>
      )
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'deliveryFee',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.deliveryFee)} VNĐ`} />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (_, record) => <Title level={5} text={record.quantity} />
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalCost',
      render: (_, record) => (
        <Title
          level={5}
          className="text-primary"
          text={`${formatPriceVND(record.totalCost)} VNĐ`}
        />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPaid',
      render: (_, record) => (
        <Title
          level={5}
          className={record.isPaid ? 'text-success' : 'text-primary'}
          text={record.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
        />
      )
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <>
          {!record?.isPaid && (
            <Row gutter={16}>
              <Col
                onClick={() => handlePayment(record)}
                className="cursor-pointer"
              >
                <Button type="primary" text="Thanh toán" />
              </Col>

              <Col
                onClick={() => handleDeleteItem(record)}
                className="cursor-pointer"
              >
                <Button text="Hủy" />
              </Col>
            </Row>
          )}
        </>
      )
    }
  ]

  return (
    <div>
      <Table columns={columns} dataSource={records} pagination={false} />
    </div>
  )
}

export default Orders
