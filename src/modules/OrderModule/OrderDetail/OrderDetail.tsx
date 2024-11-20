import { Button, Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import { formatPriceVND } from '@/src/utils/format-price'
import { setLocalStorageItem } from '@/src/utils/local-storage'
import { Col, Row, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface DataType {
  productId: string
  price: number
  amount: number
  total: number
}

const OrderDetail: React.FC = () => {
  // useRouter
  const router = useRouter()
  const orderId: string | null = (router.query?.id as string) || null

  // useState
  const [records, setRecords] = useState<DataType[]>()
  const [order, setOrder] = useState<any>()
  const [totalCost, setTotalCost] = useState<any>()

  // useEffect
  useEffect(() => {
    if (!orderId) return
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/carts?cartId=${orderId}`
        )

        if (res?.[0]) {
          setOrder(res[0])

          let total = 0
          res[0]?.productsInCard?.map((product: any) => {
            total += (product?.amount || 0) * (product?.price || 0)
          })
          total += res[0]?.deliverFee?.fee || 0

          setTotalCost(total)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [orderId])

  useEffect(() => {
    if (!order?.productsInCard) return

    const mappedRecords: DataType[] = order?.productsInCard.map((item: any) => {
      return {
        productId: item.productId,
        price: item.price,
        amount: item.amount,
        total: item.price * item.amount
      }
    })

    setRecords(mappedRecords)
  }, [order])

  // columns of table
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productId',
      render: (_, record) => (
        <Link href={'#'}>
          <Title level={5} text={record.productId} />
        </Link>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.price)} VNĐ`} />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      render: (_, record) => <Title level={5} text={record.amount} />
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
    }
  ]

  // functions
  const handlePayment = async () => {
    try {
      const payload = {
        // total: Number((totalCost / 23500).toFixed(2)),
        total: totalCost,
        details: {
          subtotal: totalCost - (order?.deliverFee?.fee || 0),
          tax: 0.0,
          shipping: order?.deliverFee?.fee || 0,
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
        JSON.stringify(order.cartId)
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

  return (
    <>
      <div>
        <Title level={4} text={`Các sản phẩm`} className="mb-4" />

        <Table columns={columns} dataSource={records} pagination={false} />
      </div>

      <Row gutter={60} className="mt-8">
        <Col>
          <Row align={'bottom'} gutter={8}>
            <Col>
              <Title level={4} text={`Mã đơn hàng:`} />
            </Col>

            <Col>
              <Title
                level={4}
                isNormal
                text={
                  order?.cartId?.substring(0, 10) ||
                  '01GZEG6G449VKMF20EHZ1TQVGF'
                }
              />
            </Col>
          </Row>

          <Row align={'bottom'} gutter={8} className="mt-4">
            <Col>
              <Title level={4} text={`Phí vận chuyển:`} />
            </Col>

            <Col>
              <Title
                level={4}
                isNormal
                text={
                  `${formatPriceVND(order?.deliverFee?.fee)} VNĐ` || '3500$'
                }
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Row align={'bottom'} gutter={8}>
            <Col>
              <Title level={4} text={`Tổng tiền:`} />
            </Col>

            <Col>
              <Title
                level={4}
                isNormal
                className="text-primary"
                text={`${formatPriceVND(totalCost)} VNĐ` || '3500$'}
              />
            </Col>
          </Row>

          <Row gutter={8} className="mt-4">
            <Col>
              <Title level={4} text={`Trạng thái:`} />
            </Col>

            <Col>
              <Title
                level={4}
                className={order?.isPaid ? 'text-success' : 'text-primary'}
                text={order?.isPaid ? `Đã thanh toán` : `Chưa thanh toán`}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {order?.isPaid ? null : (
        <Button
          size="large"
          type="primary"
          text="Thanh toán"
          className="mt-6 min-w-[200px]"
          onClick={handlePayment}
        />
      )}
    </>
  )
}

export default OrderDetail
