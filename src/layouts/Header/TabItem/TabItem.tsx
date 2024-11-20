import { Col, Row } from 'antd'
import Link from 'next/link'
import { DingdingOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

interface Props {
  href: string
  title?: string
  isHome?: boolean
}

const TabItem: React.FC<Props> = props => {
  const { href, title, isHome = false } = props

  const router = useRouter()

  return (
    <Col>
      <Row align={'middle'}>
        {isHome && <DingdingOutlined className="text-[37px] text-primary" />}

        <Link
          href={href}
          className={
            isHome
              ? 'bg-gradient-to-r from-primary to-black bg-clip-text pr-6 text-2xl font-bold text-black text-transparent hover:text-primary'
              : router.asPath === href
              ? 'rounded-lg px-7 py-1 text-base font-medium text-primary hover:text-primary'
              : 'rounded-lg px-7 py-1 text-base font-medium text-black hover:text-primary'
          }
        >
          {title}
        </Link>
      </Row>
    </Col>
  )
}

export default TabItem
