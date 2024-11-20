import { useEffect, useState } from 'react'
import mainAxios from '@/src/libs/main-axios'
import { Button, Title } from '@/src/components'
import { Col, Input, Row, Spin } from 'antd'
import LaptopItem from './LaptopItem'
import DATA from './mock-data.json'

const HomeModule: React.FC = () => {
  // useState
  const [laptops, setLaptops] = useState<any[]>()
  const [searchKey, setSearchKey] = useState<string>('')
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>(DATA)
  const [isCallingApi, setIsCallingApi] = useState(false)

  // useEffect
  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await mainAxios.get('http://localhost:3004/products')

        setLaptops(res)
        setFilteredLaptops(res)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  // functions
  const searchHandler = async () => {
    try {
      setIsCallingApi(true)

      const res: any = await mainAxios.get(
        `http://localhost:3004/products?search=${searchKey || ''}`
      )

      setFilteredLaptops(res)
    } catch (error) {
      console.log(error)
    } finally {
      setIsCallingApi(false)
    }
  }

  return (
    <div>
      <Row justify={'space-between'} align={'middle'} className="my-4">
        <Col>
          <Title
            level={4}
            text={
              filteredLaptops && filteredLaptops.length !== laptops?.length
                ? 'Sản phẩm đã tìm kiếm'
                : 'Tất cả sản phẩm'
            }
          />
        </Col>

        <Col>
          <Row gutter={16} wrap={false}>
            <Col>
              <Input
                className="min-w-[300px] border-0 p-2"
                placeholder="Nhập tên sản phẩm..."
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
              />
            </Col>

            <Col>
              <Button
                type="primary"
                className="h-full"
                text="Tìm kiếm"
                onClick={searchHandler}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {isCallingApi ? (
        <Row justify={'center'} className="mt-6">
          <Spin />
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify={'start'} className="mt-6">
          {filteredLaptops &&
            filteredLaptops?.map((item, index) => (
              <Col span={8} key={index}>
                <LaptopItem data={item} />
              </Col>
            ))}
        </Row>
      )}
    </div>
  )
}

export default HomeModule
