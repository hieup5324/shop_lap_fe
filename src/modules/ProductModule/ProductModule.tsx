/* eslint-disable @next/next/no-img-element */
import { Button, Title } from '@/src/components'
import { Col, Input, Row, message } from 'antd'
import Reputation from './Reputation/Reputation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PATH from '@/src/shared/path'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/src/redux/hooks'
import mainAxios from '@/src/libs/main-axios'
import { formatPriceVND } from '@/src/utils/format-price'

const ProductModule: React.FC = () => {
  // useRouter
  const router = useRouter()
  const productId = router.query.id

  // store
  const dispatch = useAppDispatch()

  // useState
  const [amount, setAmount] = useState(1)
  const [product, setProduct] = useState<any>()

  // useEffect
  useEffect(() => {
    if (!productId) return
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3001/products/${productId}`
        )

        setProduct(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [productId])

  // functions
  const onChangeQuantity = (newAmount: number) => {
    if (newAmount < 1) return
    if (newAmount > (product?.quantity || 1)) return

    setAmount(newAmount)
  }

  const addingToCart = async () => {
    try {
      const res = await mainAxios.post(`http://localhost:3001/cart`, {
        product_id: product?.id,
        quantity: amount
      })

      message.success('Đã thêm sản phẩm vào giỏ hàng')
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error)
      message.error('Đã xảy ra lỗi, vui lòng thử lại!')
    }
  }

  return (
    <div className="rounded bg-white p-4">
      <div className="border-b border-solid border-gray-400 pb-4">
        <Title level={3} text={product?.description} />
      </div>

      <Row gutter={24} className="mt-6">
        <Col span={6}>
          <img
            src={product?.photo_url}
            alt="laptop"
            className="h-[200px] w-full object-contain"
          />
        </Col>

        <Col span={9}>
          <div>
            <Title
              className="italic text-primary"
              text={`Deal: ${formatPriceVND(product?.price)} VNĐ`}
            />
          </div>

          <Row className="mt-4">
            <Col>
              <Title level={5} text={`Bảo hành:`} />
            </Col>

            <Col className="ml-1">
              <Title level={5} className="font-normal" text={`12 tháng`} />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Title level={5} text={`Tình trạng:`} />
            </Col>

            <Col className="ml-1.5">
              <Title
                level={5}
                className="font-normal"
                text={`${product?.quantity} sản phẩm có sẵn`}
              />
            </Col>
          </Row>

          <Row align={'middle'} gutter={16} justify={'start'} className="mt-6">
            <Col>
              <Title level={5} text={`Số lượng`} />
            </Col>

            <Col>
              <Row
                align="middle"
                className="overflow-hidden rounded-lg border border-gray-300"
              >
                <Button
                  type="default"
                  text="-"
                  onClick={() => onChangeQuantity(amount - 1)}
                  disabled={amount <= 1}
                  className="bg-white  py-1 transition-all hover:bg-gray-200"
                />

                <Input
                  value={amount}
                  onChange={e => {
                    const value = Number(e.target.value)
                    if (!isNaN(value)) onChangeQuantity(value)
                  }}
                  className="w-[60px] border-0  text-center focus:ring-0"
                />

                <Button
                  type="default"
                  text="+"
                  onClick={() => onChangeQuantity(amount + 1)}
                  disabled={amount >= (product?.quantity || 1)}
                  className="bg-white  py-1 transition-all hover:bg-gray-200"
                />
              </Row>
            </Col>
          </Row>

          <Row
            gutter={24}
            align={'bottom'}
            justify={'space-between'}
            className="mt-6"
          >
            <Col span={12}>
              <Button
                type="success"
                size="large"
                text="Thêm vào giỏ hàng"
                className="w-full"
                onClick={addingToCart}
              />
            </Col>

            <Col span={12}>
              <Link href={PATH.CART}>
                <Button
                  type="primary"
                  size="large"
                  text="Mua ngay"
                  className="w-full"
                />
              </Link>
            </Col>
          </Row>
        </Col>

        <Reputation />
      </Row>
    </div>
  )
}

export default ProductModule
