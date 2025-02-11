import { useEffect, useState } from 'react'
import { Input, Button, message } from 'antd'
import mainAxios from '@/src/libs/main-axios'
import { UserInfo } from '@/src/redux/slices/authSlice'
import { getLocalStorageItem, jsonParser } from '@/src/utils/local-storage'
import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // useEffect
  useEffect(() => {
    const localUserInfo = getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO)
      ? jsonParser(getLocalStorageItem(LOCAL_STORAGE_KEY.USER_INFO) as string)
      : null
    if (localUserInfo) {
      setUserInfo(localUserInfo)
    } else {
      message.error('Không tìm thấy thông tin người dùng!')
    }
  }, [])

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu mới và xác nhận không khớp!')
      return
    }

    if (!userInfo) {
      message.error('Không có thông tin người dùng!')
      return
    }

    setLoading(true)

    try {
      const changePassword = await mainAxios.post(
        `http://localhost:3001/users/change-password/${userInfo.id}`,
        {
          oldPassword,
          newPassword
        }
      )

      message.success('Đổi mật khẩu thành công!')
      // Reset fields after success
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      message.error('Sai mật khẩu cũ!')
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-5 shadow">
      <h2 className="mb-4 text-xl font-bold">Đổi mật khẩu</h2>

      <Input.Password
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        className="mb-3"
      />
      <Input.Password
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="mb-3"
      />
      <Input.Password
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="mb-3"
      />

      <Button type="primary" loading={loading} onClick={handleChangePassword}>
        Đổi mật khẩu
      </Button>
    </div>
  )
}

export default ChangePasswordPage
