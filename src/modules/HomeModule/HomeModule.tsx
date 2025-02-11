import { useEffect, useState } from 'react'
import mainAxios from '@/src/libs/main-axios'
import { Button, Title } from '@/src/components'
import { Col, Input, Row, Spin, List } from 'antd'
import LaptopItem from './LaptopItem'

const HomeModule: React.FC = () => {
  const [laptops, setLaptops] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>([])
  const [isCallingApi, setIsCallingApi] = useState(false)

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const categoryRes: any = await mainAxios.get(
          'http://localhost:3001/categories'
        )
        const productRes: any = await mainAxios.get(
          'http://localhost:3001/products'
        )

        setLaptops(productRes)
        setFilteredLaptops(productRes)
        setCategories(categoryRes)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchKey])

  const fetchProducts = async () => {
    try {
      setIsCallingApi(true)
      const res: any = await mainAxios.get(
        `http://localhost:3004/products?category=${selectedCategory}&search=${searchKey}`
      )
      setFilteredLaptops(res)
    } catch (error) {
      console.log(error)
    } finally {
      setIsCallingApi(false)
    }
  }

  return (
    <Row gutter={24} className="mt-4">
      <Col span={4}>
        <Row align="middle" className="mb-4">
          <Title level={4} text="Danh mục sản phẩm" />
        </Row>

        <List
          bordered
          dataSource={[{ id: '', name: 'Tất cả danh mục' }, ...categories]}
          renderItem={category => (
            <List.Item
              className={`
              ${
                selectedCategory === category.name
                  ? 'bg-blue-100 font-bold'
                  : 'bg-white'
              }
            `}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="mr-2 text-lg">•</span>
              {category.name}
            </List.Item>
          )}
          style={{ marginTop: 35 }}
        />
      </Col>

      <Col span={18}>
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title
              level={4}
              text={
                filteredLaptops.length !== laptops.length
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
                  onClick={fetchProducts}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {isCallingApi ? (
          <Row justify="center" className="mt-6">
            <Spin />
          </Row>
        ) : (
          <Row gutter={[24, 24]} justify="start" className="mt-6">
            {filteredLaptops.map((item, index) => (
              <Col span={8} key={index}>
                <LaptopItem data={item} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default HomeModule
