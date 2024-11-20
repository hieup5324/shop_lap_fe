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
import { Col, Row, Select, Spin, Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface DataType {
  name: string
  unitPrice: string
  quantity: number
  total: number
}

const ProductModule: React.FC = () => {
  // useRouter
  const router = useRouter()

  // store
  // const productsInCart = useAppSelector(state => state.cart.productsInCard)

  // useState
  const [delivery, setDelivery] = useState<number>(0)
  const [provinces, setProvinces] = useState()
  const [districts, setDistricts] = useState()
  const [wards, setWards] = useState()
  const [provinceId, setProvinceId] = useState<number>()
  const [districtId, setDistrictId] = useState<number>()
  const [wardCode, setWardCode] = useState<string>()
  const [records, setRecords] = useState<DataType[]>()
  const [totalCost, setTotalCost] = useState<number>()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [productsInCart, setProductsInCart] = useState<any[]>([])
  const [isCallingApi, setIsCallingApi] = useState(false)

  // useEffect
  useEffect(() => {
    const localProductsInCart = getLocalStorageItem(
      LOCAL_STORAGE_KEY.PRODUCTS_IN_CART
    )
      ? jsonParser(
          getLocalStorageItem(LOCAL_STORAGE_KEY.PRODUCTS_IN_CART) as string
        )
      : []

    setProductsInCart(localProductsInCart)
  }, [])

  useEffect(() => {
    const localUserInfo = getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO)
      ? jsonParser(getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO) as string)
      : {}

    setUserInfo(localUserInfo)
  }, [])

  useEffect(() => {
    if (!productsInCart) return

    const mappedRecords: DataType[] = productsInCart.map((item: any) => ({
      id: item.productId,
      name: item.productName,
      unitPrice: item.price,
      quantity: item.amount,
      total: item.price * item.amount
    }))

    setRecords(mappedRecords)
  }, [productsInCart])

  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/delivery/provinces`
        )

        const mappedProvines = res.map((item: any, index: number) => ({
          value: item.ProvinceID,
          label: item.ProvinceName
        }))

        setProvinces(mappedProvines)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    if (!provinceId) return
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/delivery/districts/${provinceId}`
        )

        const mappedDistricts = res.map((item: any, index: number) => ({
          value: item.DistrictID,
          label: item.DistrictName
        }))

        setDistricts(mappedDistricts)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [provinceId])

  useEffect(() => {
    if (!districtId || !provinceId) return
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/delivery/wards/${districtId}`
        )

        const mappedWards = res.map((item: any, index: number) => ({
          value: item.WardCode,
          label: item.WardName
        }))

        setWards(mappedWards)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [districtId, provinceId])

  useEffect(() => {
    let currentTotalCost = 0

    productsInCart.map((item: any) => {
      currentTotalCost += item?.amount * item?.price
    })

    if (delivery) {
      currentTotalCost += delivery
    }

    if (currentTotalCost) {
      setTotalCost(currentTotalCost)
    }
  }, [delivery, productsInCart])

  // functions
  const handleDeleteItem = (record: any) => {
    const filteredProductsInCart = productsInCart.filter(
      (item: any) => item.productId != record.id
    )

    console.log(filteredProductsInCart)

    setProductsInCart(filteredProductsInCart)

    setLocalStorageItem(
      LOCAL_STORAGE_KEY.PRODUCTS_IN_CART,
      JSON.stringify(filteredProductsInCart)
    )
  }

  const onChangeProvice = (value: number) => {
    setProvinceId(value)
    setDistrictId(undefined)
    setWardCode(undefined)
  }

  const onChangeDistrist = (value: number) => {
    setDistrictId(value)
    setWardCode(undefined)
  }

  const onChangeWard = (value: string) => {
    setWardCode(value)
  }

  const addingOrderHandler = async () => {
    if (
      !userInfo?.userId ||
      !wardCode ||
      !districtId ||
      productsInCart?.length < 1
    )
      return

    try {
      setIsCallingApi(true)

      const payload = {
        addressId: districtId,
        wardCode,
        note: null,
        productsInCard: productsInCart
      }

      await mainAxios.post(
        `http://localhost:3004/carts?userId=${userInfo?.userId}`,
        payload
      )

      message.success(`Đặt hàng thành công`)

      setLocalStorageItem(
        LOCAL_STORAGE_KEY.PRODUCTS_IN_CART,
        JSON.stringify([])
      )

      setTimeout(() => {
        router.push(PATH.ORDERS)
      }, 2000)
    } catch (error) {
      console.log(error)
    } finally {
      setIsCallingApi(false)
    }
  }

  const costCalculationHandler = async () => {
    if (!districtId || !wardCode) return

    try {
      setIsCallingApi(true)

      const payload = {
        districtId,
        wardCode
      }

      const res: any = await mainAxios.post(
        `http://localhost:3004/delivery`,
        payload
      )

      setDelivery(res?.fee || 0)
    } catch (error) {
      console.log(error)
    } finally {
      setIsCallingApi(false)
    }
  }

  // columns of table
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render: (_, record) => <Title level={5} text={record.name} />
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      render: (_, record) => (
        <Title level={5} text={`${formatPriceVND(record.unitPrice)} VNĐ`} />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (_, record) => <Title level={5} text={record.quantity} />
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
      render: (_, record) => (
        <div
          onClick={() => handleDeleteItem(record)}
          className="cursor-pointer hover:[&>*]:text-blue-500"
        >
          <Title text={'Xóa'} level={5} isNormal />
        </div>
      )
    }
  ]

  return (
    <div>
      <Table columns={columns} dataSource={records} pagination={false} />

      <Row className="mt-6" align={'middle'} gutter={50}>
        <Col>
          <Row gutter={16} align={'middle'}>
            <Col>
              <Title level={5} isNormal text={'Chọn tỉnh'} />
            </Col>

            <Col>
              <Select
                showSearch
                placeholder="Sơn La"
                optionFilterProp="children"
                onChange={onChangeProvice}
                className="min-w-[150px]"
                options={provinces}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Row gutter={24} align={'middle'}>
            <Col>
              <Title level={5} isNormal text={'Chọn huyện'} />
            </Col>

            <Col>
              <Select
                placeholder="Mai Sơn"
                optionFilterProp="children"
                onChange={onChangeDistrist}
                className="min-w-[150px]"
                options={districts}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Row gutter={24} align={'middle'}>
            <Col>
              <Title level={5} isNormal text={'Chọn xã'} />
            </Col>

            <Col>
              <Select
                showSearch
                placeholder="Bình Minh"
                optionFilterProp="children"
                onChange={onChangeWard}
                className="min-w-[150px]"
                options={wards}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Button
            type="primary"
            text="Tính phí vận chuyển"
            onClick={costCalculationHandler}
          />
        </Col>
      </Row>

      {(delivery && totalCost && (
        <Row justify={'space-between'} className="mt-10">
          <Col>
            <Title
              level={4}
              text={`Phí vận chuyển: ${formatPriceVND(delivery)} VNĐ`}
            />
          </Col>

          <Col>
            <Row gutter={24} align={'middle'} justify={'end'}>
              <Col>
                <Row align={'middle'} gutter={16}>
                  <Col>
                    <Title
                      level={4}
                      isNormal
                      text={`Tổng thanh toán (${productsInCart.length} sản phẩm):`}
                    />
                  </Col>

                  <Col>
                    <Title
                      className="text-primary"
                      level={3}
                      isNormal
                      text={`${formatPriceVND(totalCost)} VNĐ`}
                    />
                  </Col>
                </Row>
              </Col>

              <Col>
                <Button
                  onClick={addingOrderHandler}
                  size="large"
                  type="primary"
                  text="Đặt hàng"
                  className="min-w-[200px]"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )) ||
        null}

      {(isCallingApi && (
        <Row justify={'center'} className="mt-10">
          <Spin />
        </Row>
      )) ||
        null}
    </div>
  )
}

export default ProductModule
