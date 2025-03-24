export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const PaymentMethod = {
  vnpay: 'vnpay',
  cash: 'cash'
}

export const getPaymentMethodLabel = (paymentType: any): string => {
  switch (paymentType) {
    case PaymentMethod.vnpay:
      return 'VNPAY'
    case PaymentMethod.cash:
      return 'Tiền mặt'
    default:
      return 'Không xác định'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case PAYMENT_STATUS.FAILED:
      return 'red'
    case PAYMENT_STATUS.PENDING:
      return 'orange'
    case PAYMENT_STATUS.SUCCESS:
      return 'green'
    default:
      return 'gray'
  }
}
