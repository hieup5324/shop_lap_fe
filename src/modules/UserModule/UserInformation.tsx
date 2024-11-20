import { createFromIconfontCN, InstagramOutlined } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
})

const UserInformation = () => {
  const data = {
    fullName: 'Alec M. Thompson',
    mobile: '(44) 123 1234 123',
    email: 'alecthompson@mail.com',
    location: 'VietNam',
    social: [
      {
        url: '/fb',
        label: 'facebook'
      },
      {
        url: '/twiter',
        label: 'twiter'
      },
      {
        url: '/insta',
        label: 'instagram'
      }
    ]
  }
  return (
    <div className="lg:mx-auto lg:w-4/5">
      <div
        style={{
          backgroundImage:
            'linear-gradient(195deg, rgba(73, 163, 241, 0.6), rgba(26, 115, 232, 0.6)), url(/images/banner_infor.jpeg)'
        }}
        className="h-[300px] w-full rounded-2xl bg-cover bg-center bg-no-repeat"
      ></div>
      <div className="mx-auto -mt-20 w-[95%] rounded-2xl bg-[#ffff] px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src="/images/avatar.jpg"
            className="h-[74px] w-[74px] rounded-full"
          />

          <div>
            <p className="text-[20px] font-semibold">Richard Davis</p>
            <p className="text-[14px] font-light">CEO / Co-Founder</p>
          </div>
        </div>

        <div className="mt-6">
          <div>
            <div className="text-[18px] font-medium">Profile Information</div>
            <p className="font-light">
              Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer
              is no. If two equally difficult paths, choose the one more painful
              in the short term (pain avoidance is creating an illusion of
              equality).
            </p>
          </div>

          <div className="mt-6 font-light">
            <div className="flex gap-4">
              <p className="font-medium">Full Name :</p>
              <p>{data.fullName}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Mobile :</p>
              <p>{data.mobile}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Email :</p>
              <p>{data.email}</p>
            </div>
            <div className="flex gap-4">
              <p className="font-medium">Location :</p>
              <p>{data.location}</p>
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
