/* eslint-disable @next/next/no-img-element */
import { Button, Title } from '@/src/components'
import { Col, Input, Row, message } from 'antd'
import Reputation from './Reputation/Reputation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PATH from '@/src/shared/path'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/src/redux/hooks'
import { addProduct } from '@/src/redux/slices/cartSlice'
import mainAxios from '@/src/libs/main-axios'
import { formatPriceVND } from '@/src/utils/format-price'
import {
  getLocalStorageItem,
  jsonParser,
  setLocalStorageItem
} from '@/src/utils/local-storage'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'

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
          `http://localhost:3004/products/${productId}`
        )

        setProduct(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [productId])

  // functions
  const onChangeQuantity = (e: any) => {
    setAmount(Number(e.target.value))
  }

  const addingToCart = () => {
    if (!product) return

    const productsInCart = getLocalStorageItem(
      LOCAL_STORAGE_KEY.PRODUCTS_IN_CART
    )
      ? jsonParser(
          getLocalStorageItem(LOCAL_STORAGE_KEY.PRODUCTS_IN_CART) as string
        )
      : []

    const newProduct = {
      productId,
      amount,
      productName: product.productName,
      type: product.type,
      price: product.price,
      description: product.description
    }

    const newProductsInCart = [...productsInCart, newProduct]

    setLocalStorageItem(
      LOCAL_STORAGE_KEY.PRODUCTS_IN_CART,
      JSON.stringify(newProductsInCart)
    )

    // dispatch(
    //   addProduct({
    //     productId,
    //     amount,
    //     productName: product.productName,
    //     type: product.type,
    //     price: product.price,
    //     description: product.description
    //   })
    // )

    message.success('Thêm vào giỏ hàng thành công')
  }

  return (
    <div className="rounded bg-white p-4">
      <div className="border-b border-solid border-gray-400 pb-4">
        <Title
          level={3}
          text={`[Mới 100%] Dell Gaming G15 5525 (Ryzen 5-6600H, 8GB, 512GB, RTX 3050 4GB, 15.6'' FHD 120Hz)`}
        />
      </div>

      <Row gutter={24} className="mt-6">
        <Col span={6}>
          <img
            src={product?.photoUrl}
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
              <Title
                level={5}
                className="font-normal"
                text={`12 tháng`}
              />
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
              <Input
                value={amount}
                onChange={onChangeQuantity}
                size="small"
                className="min-w-fit max-w-[60px] px-4 py-1"
              />
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
