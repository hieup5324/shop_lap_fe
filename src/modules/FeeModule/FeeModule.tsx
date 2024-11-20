import { Title } from '@/src/components'
import mainAxios from '@/src/libs/main-axios'
import { Button, Col, Result, Row, Select } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const FeeModule: React.FC = () => {
  const [provinces, setProvinces] = useState()

  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await mainAxios.get(
          `http://localhost:3004/delivery/provinces`
        )

				// const mappedProvines =
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <div>
      <Row gutter={24} align={'middle'}>
        <Col>
          <Title level={5} isNormal text={'Chọn tỉnh'} />
        </Col>

        <Col>
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChange}
            options={[
              {
                value: 'jack',
                label: 'Jack'
              },
              {
                value: 'lucy',
                label: 'Lucy'
              },
              {
                value: 'tom',
                label: 'Tom'
              }
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}

export default FeeModule
