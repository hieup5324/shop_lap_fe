import { Card, Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const PaymentSuccessPage = () => {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Card className="rounded-lg bg-white p-6 text-center shadow-lg">
        <CheckCircleOutlined className="mb-4 text-6xl text-green-500" />
        <h2 className="text-xl font-semibold">Thanh toán thành công!</h2>
        <p className="text-gray-600">Cảm ơn bạn đã mua hàng.</p>
        <Button type="primary" className="mt-4" onClick={handleGoHome}>
          Quay lại trang chủ
        </Button>
      </Card>
    </div>
  )
}

export default PaymentSuccessPage 