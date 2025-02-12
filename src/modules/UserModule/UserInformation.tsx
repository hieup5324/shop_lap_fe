import LOCAL_STORAGE_KEY from '@/src/shared/local-storage-key'
import { createFromIconfontCN, InstagramOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
})

const UserInformation = () => {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO)
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="lg:mx-auto lg:w-4/5">
      <div className="h-[150px] w-full rounded-2xl bg-cover bg-center bg-no-repeat"></div>
      <div className="mx-auto -mt-20 w-[95%] rounded-2xl bg-[#ffff] px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={userData.photo_url || '/images/avatar.jpg'}
            className="h-[74px] w-[74px] rounded-full"
          />

          <div>
            <p className="text-[20px] font-semibold">
              {userData.first_name + ' ' + userData.last_name}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mt-6 font-light">
            <div className="flex gap-4">
              <p className="font-medium">Email :</p>
              <p>{userData.email}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Full Name :</p>
              {userData.first_name + ' ' + userData.last_name}
              <p></p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Mobile :</p>
              <p>{userData.phone || ''}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Date Of Birth :</p>
              <p>{userData.date_of_birth}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Location :</p>
              <p>{'Viet Nam'}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Social :</p>
              <div className="flex gap-2">
                <a href="https://cms.dev.1880.global/admin/content-manager/single-types/api::home.home">
                  <IconFont type="icon-facebook" style={{ color: '#1877F2' }} />
                </a>
                <a href="https://cms.dev.1880.global/admin/content-manager/single-types/api::home.home">
                  <InstagramOutlined />
                </a>
                <a href="https://cms.dev.1880.global/admin/content-manager/single-types/api::home.home">
                  <IconFont type="icon-twitter" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInformation
