/* eslint-disable @next/next/no-img-element */
import { Button, Title } from '@/src/components'
import { formatPriceVND } from '@/src/utils/format-price'
import { Col, Rate, Row } from 'antd'
import Link from 'next/link'

interface Props {
  data?: any
}

const LaptopItem: React.FC<Props> = props => {
  const { data } = props

  return (
    <Link href={`/product/${data?.id}`} className="block h-full">
      <div className="group h-full w-full overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
        <img
          src={data?.photo_url}
          alt="laptop"
          className="h-[200px] w-full object-contain transition delay-150 ease-in-out group-hover:scale-125"
        />

        <div className="h-[calc(100%-112px)] w-full">
          <Row>
            <Col span={24}>
              <Title level={3} text={data?.product_name} />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Title
                level={4}
                className="text-primary"
                text={`${formatPriceVND(data?.price)} VNĐ`}
              />
            </Col>
          </Row>

          <Title
            level={5}
            text={`Còn hàng: ${data?.quantity || 0}`}
            isNormal
            className="mt-2 text-gray-600"
          />
        </div>
      </div>
    </Link>
  )
}

export default LaptopItem
