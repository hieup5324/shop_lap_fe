import { useEffect, useState } from 'react'
import mainAxios from '@/src/libs/main-axios'
import { Button, Title } from '@/src/components'
import { Col, Input, Row, Spin, List, Pagination, Select } from 'antd'
import LaptopItem from './LaptopItem'

const HomeModule: React.FC = () => {
  const [laptops, setLaptops] = useState<any[]>([])
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')
  const [isCallingApi, setIsCallingApi] = useState(false)
  const [priceSort, setPriceSort] = useState<string>('')

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const pageSize = 6
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      try {
        const categoryRes: any = await mainAxios.get(
          'http://localhost:3001/categories'
        )
        setCategories(categoryRes.data || [])
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchKey, page, priceSort])

  const fetchProducts = async () => {
    try {
      setIsCallingApi(true)

      let url = `http://localhost:3001/products?page=${page}&page_size=${pageSize}`

      if (searchKey) {
        url += `&search=${searchKey}`
      }

      if (priceSort) {
        url += `&price=${priceSort}`
      }

      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`
      }

      const res: any = await mainAxios.get(url)

      setFilteredLaptops(res.data || [])
      setTotal(res.paging.total || 0)
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
              className={`${
                selectedCategory === category.id
                  ? 'bg-blue-100 font-bold'
                  : 'bg-white'
              }`}
              onClick={() => {
                setSelectedCategory(category.id)
                setPage(1)
              }}
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
          <Col span={6}>
            <Row align="middle" gutter={8}>
              <Col>
                <Title level={5} text="Lọc theo giá:" className="mb-0" />
              </Col>
              <Col flex="auto">
                <Select
                  placeholder="Chọn cách sắp xếp"
                  style={{ width: '100%' }}
                  value={priceSort}
                  onChange={value => {
                    setPriceSort(value)
                    setPage(1)
                  }}
                  options={[
                    { label: 'Giá tăng dần', value: 'asc' },
                    { label: 'Giá giảm dần', value: 'desc' },
                    { label: 'Mặc định', value: '' }
                  ]}
                />
              </Col>
            </Row>
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
                  onClick={() => setPage(1)}
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
          <>
            <Row gutter={[24, 24]} justify="start" className="mt-6">
              {filteredLaptops.map((item, index) => (
                <Col span={8} key={index}>
                  <LaptopItem data={item} />
                </Col>
              ))}
            </Row>

            <Row justify="center" className="mt-6">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={newPage => setPage(newPage)}
                showSizeChanger={false}
              />
            </Row>
          </>
        )}
      </Col>
    </Row>
  )
}

export default HomeModule
