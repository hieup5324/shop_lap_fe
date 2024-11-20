import Footer from './Footer'
import Header from './Header'

interface Props {
  children?: React.ReactNode
}

const MainLayout: React.FC<Props> = props => {
  const { children } = props

  return (
    <div className="bg-zinc-100">
      <Header />

      <div
        className={`mt-[116px] min-h-[calc(100vh-122px-196px)] px-[90px] py-6`}
      >
        {children}
      </div>

      <Footer />
    </div>
  )
}

export default MainLayout
