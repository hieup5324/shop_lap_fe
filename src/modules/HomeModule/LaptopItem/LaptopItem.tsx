/* eslint-disable @next/next/no-img-element */
import { Button, Title } from '@/src/components'
import { formatPriceVND } from '@/src/utils/format-price'
import { Col, Rate, Row } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  data?: any
}

const LaptopItem: React.FC<Props> = props => {
  const { data } = props

  return (
    <Link href={`/product/${data?.productId}`} className="block h-full">
      <div className="group h-full w-full overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
        <img
          src={data?.photoUrl}
          alt="laptop"
          className="h-[200px] w-full object-contain transition delay-150 ease-in-out group-hover:scale-125"
        />

        <div className="h-[calc(100%-112px)] w-full">
          <Row align={'bottom'} justify={'space-between'}>
            <Col>
              <Title level={3} text={data?.productName} />
            </Col>

            <Col>
              <Title
                level={4}
                className="text-primary"
                text={`${formatPriceVND(data?.price)} VNĐ`}
              />
            </Col>
          </Row>

          <Row align={'middle'} justify={'space-between'}>
            <Col>
              <Rate defaultValue={4} disabled />
            </Col>

            <Col>
              <Title level={5} text={'Đã bán 1,2k'} isNormal />
            </Col>
          </Row>

          <Title level={5} text={'Hải Dương'} isNormal className="mt-2" />
        </div>
      </div>
    </Link>
  )
}

export default LaptopItem
