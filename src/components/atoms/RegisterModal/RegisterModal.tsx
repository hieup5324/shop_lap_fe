import mainAxios from '@/src/libs/main-axios'
import { Col, Divider, Input, Modal, Row, message } from 'antd'
import { useState } from 'react'
import { useAppDispatch } from '@/src/redux/hooks'
import { setIsAuthenticated, setUserInfo } from '@/src/redux/slices/authSlice'
import { setCookie } from '@/src/utils/cookie'
import { isAuthenticatedJwt } from '@/src/utils/jwt'
import { setLocalStorageItem } from '@/src/utils/local-storage'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import COOKIE_KEY from '@/src/shared/cookie-key'
import Title from '../Title'
import Button from '../Button'

interface Props {
  visible?: boolean
  setVisible: (value: boolean) => void
}

const RegisterModal: React.FC<Props> = ({ visible = false, setVisible }) => {
  const dispatch = useAppDispatch()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleRegister = async () => {
    try {
      const res: any = await mainAxios.post(`http://localhost:3001/users`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      })
      if (res?.access_token) {
        setCookie(COOKIE_KEY.TOKEN, res.access_token, 365)

        if (isAuthenticatedJwt(res.access_token)) {
          dispatch(setIsAuthenticated(true))
          setVisible(false)
          message.success(`Đăng ký thành công, chào mừng ${firstName}!`)
        }
      }

      if (res?.user) {
        setLocalStorageItem(
          LOCAL_STORAGE_KEY.USER_INFO,
          JSON.stringify(res.user)
        )
        dispatch(setUserInfo(res?.user))
      }
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error)
      message.error(
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!'
      )
    }
  }

  return (
    <Modal
      title={<Title level={3} text="Đăng ký" />}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="py-6">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={5} text="Họ" />
            <Input
              placeholder="Nhập họ của bạn..."
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ marginTop: 10 }}
            />
          </Col>
          <Col span={12}>
            <Title level={5} text="Tên" />
            <Input
              placeholder="Nhập tên của bạn..."
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ marginTop: 10 }}
            />
          </Col>
        </Row>

        <div className="mt-4">
          <Title level={5} text="Email" />
          <Input
            placeholder="Email của bạn..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>

        <div className="mt-4">
          <Title level={5} text="Mật khẩu" />
          <Input.Password
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>

        <Button
          size="large"
          type="secondary"
          className="mt-4 w-full"
          onClick={handleRegister}
          text="Đăng ký"
        />
      </div>
    </Modal>
  )
}

export default RegisterModal
