import PATH from '@/src/shared/path'
import { Avatar, Col, Row, Tooltip, Typography } from 'antd'
import { useEffect, useState } from 'react'
import TabItem from './TabItem/TabItem'
import { deleteCookie, getCookie } from '@/src/utils/cookie'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import { isAuthenticatedJwt } from '@/src/utils/jwt'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'
import {
  clearUserInfo,
  getIsAuthenticated,
  setIsAuthenticated,
  setUserInfo
} from '@/src/redux/slices/authSlice'
import { Button, LoginModal, Title } from '@/src/components'
import {
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import COOKIE_KEY from '@/src/shared/cookie-key'
import RegisterModal from '@/src/components/atoms/RegisterModal/RegisterModal'

const Header: React.FC = () => {
  // store
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(getIsAuthenticated)
  const userInfo = useAppSelector(state => state.auth.userInfo)

  // useState
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useState(false)
  const [isVisibleRegisterModal, setIsVisibleRegisterModal] = useState(false)

  // functions
  const showLoginModal = () => {
    setIsVisibleLoginModal(true)
  }
  const showRegisterModal = () => {
    setIsVisibleRegisterModal(true)
  }
  const handleLogout = () => {
    deleteCookie(COOKIE_KEY.TOKEN)
    localStorage.clear()
    dispatch(clearUserInfo())
    window.location.reload()
  }

  // useEffect
  useEffect(() => {
    const token = getCookie(COOKIE_KEY.TOKEN)

    if (token && isAuthenticatedJwt(token)) {
      dispatch(setIsAuthenticated(true))
    } else {
      dispatch(setIsAuthenticated(false))
    }

    const userInfo = localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)
    if (userInfo) {
      dispatch(setUserInfo(JSON.parse(userInfo)))
    }
  }, [dispatch])

  return (
    <>
      <Row
        justify={'space-between'}
        align={'middle'}
        className="fixed top-0 z-[1] w-screen border-b-[1px] border-solid border-b-slate-200 bg-white px-[120px] py-[42px]"
        // className="fixed top-0 z-[1] w-screen border-b-[1px] border-solid border-b-slate-200 bg-zinc-300 px-[120px] py-[42px]"
      >
        <Col className="ml-[-30px]">
          <Row align={'middle'}>
            <TabItem href={PATH.HOME} title="LAPTOP SHOP" isHome />
            <TabItem href={PATH.CART} title="Xem giỏ hàng" />
            <TabItem href={PATH.ORDERS} title="Các đơn đặt hàng" />
            <TabItem href={`#`} title="Tư vấn khách hàng" />
            <TabItem href={`#`} title="Flash sale" />
          </Row>
        </Col>

        {!isAuthenticated && (
          <Col className="mr-[-30px]">
            <Row justify={'center'} gutter={16}>
              <Col>
                <Button
                  type="primary"
                  text="Đăng nhập"
                  onClick={showLoginModal}
                />
              </Col>

              <Col>
                <Button text="Đăng ký" onClick={showRegisterModal} />
              </Col>
            </Row>
          </Col>
        )}

        {isAuthenticated && (
          <Col className="mr-[-30px]">
            <Tooltip
              // trigger={'click'}
              arrow={false}
              overlayInnerStyle={{ background: `white` }}
              className="mr-4"
              placement="bottomRight"
              overlay={
                <div className="p-2">
                  <Link href={PATH.USER_DETAIL}>
                    {/* <Row className="rounded px-2 py-2 hover:bg-slate-200"> */}
                    <Row
                      gutter={8}
                      align={'middle'}
                      className="rounded px-2 py-2 hover:bg-slate-100"
                    >
                      <Col>
                        <Row align={'middle'}>
                          <UserOutlined style={{ color: `black` }} />
                        </Row>
                      </Col>

                      <Col>
                        <Title level={5} isNormal text={`Thông tin cá nhân`} />
                      </Col>
                    </Row>
                  </Link>

                  <Link href={PATH.ORDERS}>
                    <Row
                      gutter={8}
                      align={'middle'}
                      className="rounded px-2 py-2 hover:bg-slate-100"
                    >
                      <Col>
                        <Row align={'middle'}>
                          <ShoppingCartOutlined style={{ color: `black` }} />
                        </Row>
                      </Col>

                      <Col>
                        <Title level={5} isNormal text={`Các đơn đặt hàng`} />
                      </Col>
                    </Row>
                  </Link>

                  <Link href={PATH.CHANGE_PASSWORD}>
                    <Row
                      gutter={8}
                      align={'middle'}
                      className="rounded px-2 py-2 hover:bg-slate-100"
                    >
                      <Col>
                        <Row align={'middle'}>
                          <SettingOutlined style={{ color: `black` }} />
                        </Row>
                      </Col>

                      <Col>
                        <Title level={5} isNormal text={`Đổi mật khẩu`} />
                      </Col>
                    </Row>
                  </Link>

                  <div className="mt-2">
                    <Button
                      onClick={handleLogout}
                      className="w-full"
                      text="Đăng xuất"
                    />
                  </div>
                </div>
              }
            >
              <Row className="cursor-default" align={'middle'}>
                <Col className="mr-2">
                  <Row align={'middle'} className="h-full">
                    <Title
                      isNormal
                      level={5}
                      text={
                        userInfo
                          ? `${userInfo.first_name} ${userInfo.last_name}`
                          : 'Người dùng'
                      }
                    />
                  </Row>
                </Col>
                <Col>
                  <Avatar
                    size={'default'}
                    icon={
                      userInfo ? (
                        <img
                          src={userInfo?.photo_url}
                          className="h-[30px] w-[30px] rounded-full"
                        />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                </Col>
              </Row>
            </Tooltip>
          </Col>
        )}
      </Row>

      {/* portal elements */}
      <>
        {isVisibleLoginModal && (
          <LoginModal
            visible={isVisibleLoginModal}
            setVisible={setIsVisibleLoginModal}
          />
        )}
        {isVisibleRegisterModal && (
          <RegisterModal
            visible={isVisibleRegisterModal}
            setVisible={setIsVisibleRegisterModal}
          />
        )}
      </>
    </>
  )
}

export default Header
