export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  WAITING_PICK_UP: 'waiting pick up',
  BEING_DELIVERY: 'being delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

export const PaymentMethod = {
  vnpay: 'vnpay',
  cash: 'cash'
}

export const convertOrderStatus = (status: string): string => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return 'Đang chờ xử lý'
    case ORDER_STATUS.WAITING_PICK_UP:
      return 'Đang chờ lấy hàng'
    case ORDER_STATUS.BEING_DELIVERY:
      return 'Đang giao hàng'
    case ORDER_STATUS.DELIVERED:
      return 'Đã giao hàng'
    case ORDER_STATUS.CANCELLED:
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
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

export const convertPaymentStatus = (paymentStatus: any): string => {
  switch (paymentStatus) {
    case PAYMENT_STATUS.SUCCESS:
      return 'Đã thanh toán'
    case PAYMENT_STATUS.PENDING:
      return 'Chưa thanh toán'
    case PAYMENT_STATUS.FAILED:
      return 'Thanh toán thất bại'
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
