import { useEffect, useState } from 'react'
import mainAxios from '@/src/libs/main-axios'
import { Button, Title } from '@/src/components'
import { Col, Input, Row, Spin, List, Pagination } from 'antd'
import LaptopItem from './LaptopItem'

const HomeModule: React.FC = () => {
  const [laptops, setLaptops] = useState<any[]>([])
  const [filteredLaptops, setFilteredLaptops] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')
  const [isCallingApi, setIsCallingApi] = useState(false)

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
  }, [selectedCategory, searchKey, page])

  const fetchProducts = async () => {
    try {
      setIsCallingApi(true)

      let url = selectedCategory
        ? `http://localhost:3001/categories/product?page=${page}&page_size=${pageSize}&category=${selectedCategory}`
        : `http://localhost:3001/products?page=${page}&page_size=${pageSize}`

      if (searchKey) {
        url += `&search=${searchKey}`
      }

      const res: any = await mainAxios.get(url)

      setFilteredLaptops(res.data || []) // Điều chỉnh để lấy dữ liệu đúng từ `res.data`
      setTotal(res.paging.total || 0) // Cập nhật tổng số sản phẩm từ `res.paging.total`
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
