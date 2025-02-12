import mainAxios from '@/src/libs/main-axios'
import { Col, Divider, Input, Modal, Row, message } from 'antd'
import { useState } from 'react'
import { setCookie } from '@/src/utils/cookie'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import { isAuthenticatedJwt } from '@/src/utils/jwt'
import { useAppDispatch } from '@/src/redux/hooks'
import {
  UserInfo,
  setIsAuthenticated,
  setUserInfo
} from '@/src/redux/slices/authSlice'
import Title from '../Title'
import Button from '../Button'
import { setLocalStorageItem } from '@/src/utils/local-storage'
import COOKIE_KEY from '@/src/shared/cookie-key'

interface LoginRes {
  access_token?: string | any
  expires_in?: number | any
  scope?: string | any
  token_type?: string | any
  user?: UserInfo
}

interface Props {
  visible?: boolean
  setVisible: (value: boolean) => void
}

const LoginModal: React.FC<Props> = props => {
  const { visible = false, setVisible } = props

  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('mminhvcvc1@gmail.com')
  const [password, setPassword] = useState('123456')

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleLogin = async () => {
    try {
      const res: LoginRes = await mainAxios.post(
        `http://localhost:3001/users/login`,
        { email, password }
      )

      if (res?.access_token) {
        const token = res.access_token
        setCookie(COOKIE_KEY.TOKEN, token, 365)

        if (isAuthenticatedJwt(token)) {
          dispatch(setIsAuthenticated(true))
          setVisible(false)
          message.success(`Đăng nhập thành công`)
        }
      } else {
        throw new Error('Không nhận được access_token từ server.')
      }

      if (res?.user) {
        setLocalStorageItem(
          LOCAL_STORAGE_KEY.USER_INFO,
          JSON.stringify(res.user)
        )
        dispatch(setUserInfo(res.user))
      } else {
        throw new Error('Không nhận được thông tin người dùng.')
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error)
      message.error(
        error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!'
      )
    }
  }

  const loginGoogleHandler = async () => {
    try {
      const googleLoginUrl = 'http://localhost:3001/google/login-google'

      const popup = window.open(
        googleLoginUrl,
        'googleLogin',
        'width=500,height=600'
      )

      if (!popup) {
        throw new Error('Không thể mở cửa sổ đăng nhập Google')
      }

      const listener = (event: MessageEvent) => {
        if (event.origin !== 'http://localhost:3001') return

        const userData = event.data
        if (userData?.access_token) {
          const token = userData.access_token

          setCookie(COOKIE_KEY.TOKEN, token, 365)

          if (isAuthenticatedJwt(token)) {
            dispatch(setIsAuthenticated(true))
            setVisible(false)

            message.success(`Đăng nhập thành công`)
          }
        }

        setLocalStorageItem(
          LOCAL_STORAGE_KEY.USER_INFO,
          JSON.stringify(userData.user)
        )
        dispatch(setUserInfo(userData.user))

        window.removeEventListener('message', listener)
      }

      window.addEventListener('message', listener)
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error)
    }
  }

  return (
    <Modal
      title={<Title level={3} text={`Đăng nhập`} />}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="py-6">
        <div>
          <Title level={5} text={`Email`} />
          <Input
            placeholder="Email của bạn..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>

        <div className="mt-4">
          <Title level={5} text={`Mật khẩu`} />
          <Input.Password
            placeholder="Mật khẩu của bạn"
            style={{ marginTop: 8, marginBottom: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <Button
          size="large"
          type="secondary"
          className="mt-4 w-full"
          onClick={handleLogin}
          text="Đăng nhập"
        />

        <Divider>Hoặc</Divider>

        <Row gutter={16}>
          <Col className="cursor-pointer" span={12}>
            <Row
              onClick={loginGoogleHandler}
              justify={'center'}
              className="rounded-lg bg-slate-100 px-4 py-3"
            >
              <Title level={5} text={`Đăng nhập bằng Google`} />
            </Row>
          </Col>

          <Col
            span={12}
            className="cursor-pointer"
            onClick={() =>
              (window.location.href = process.env
                .NEXT_PUBLIC_LOGIN_FACEBOOK as string)
            }
          >
            <Row
              justify={'center'}
              className="rounded-lg bg-slate-100 px-4 py-3"
            >
              <Title level={5} text={`Đăng nhập bằng Facebook`} />
            </Row>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

export default LoginModal
