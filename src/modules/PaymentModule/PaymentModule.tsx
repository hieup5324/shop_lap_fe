import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Card, Button, Spin } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import mainAxios from '@/src/libs/main-axios'
import { formatPriceVND } from '@/src/utils/format-price'
import { PAYMENT_STATUS } from '@/src/constant/constant'

const PaymentModule = () => {
  const router = useRouter()
  const { transactionId } = router.query
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (transactionId) {
      fetchTransaction(transactionId as string)
    }
  }, [transactionId])

  const fetchTransaction = async (id: string) => {
    try {
      const response = await mainAxios.get(`http://localhost:3001/vnpay/${id}`)
      setTransaction(response)
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giao dịch:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Card className="rounded-lg bg-white p-6 text-center shadow-lg">
          {error || !transaction ? (
            <>
              <CloseCircleOutlined className="mb-4 text-6xl text-red-500" />
              <h2 className="text-xl font-semibold">
                Không tìm thấy giao dịch!
              </h2>
              <p className="text-gray-600">
                Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
            </>
          ) : (
            <>
              {transaction.transaction_status === PAYMENT_STATUS.SUCCESS ? (
                <>
                  <CheckCircleOutlined className="mb-4 text-6xl text-green-500" />
                  <h2 className="text-xl font-semibold">
                    Thanh toán thành công!
                  </h2>
                  <p className="text-gray-600">Cảm ơn bạn đã mua hàng.</p>
                </>
              ) : (
                <>
                  <CloseCircleOutlined className="mb-4 text-6xl text-red-500" />
                  <h2 className="text-xl font-semibold">
                    Thanh toán thất bại!
                  </h2>
                  <p className="text-gray-600">
                    Vui lòng thử lại hoặc liên hệ hỗ trợ.
                  </p>
                </>
              )}
              <div className="mt-4 text-left">
                <p>
                  <strong>Mã đơn hàng:</strong> {transaction?.order?.order_code}
                </p>
                <p>
                  <strong>Số tiền:</strong>{' '}
                  {`${formatPriceVND(transaction.amount)} VNĐ`}
                </p>
                <p>
                  <strong>Ngân hàng:</strong> {transaction.bank_code}
                </p>
                <p>
                  <strong>Thời gian thanh toán: </strong>
                  {new Date(transaction.pay_date).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
          <Button type="primary" className="mt-4" onClick={handleGoHome}>
            Quay lại trang chủ
          </Button>
        </Card>
      )}
    </div>
  )
}

export default PaymentModule
