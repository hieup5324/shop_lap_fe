import '@/src/styles/style.scss'
import type { AppProps } from 'next/app'
import { ThemeContextProvider } from '../contexts/theme-context'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import MainLayout from '../layouts/MainLayout'
import dynamic from 'next/dynamic'

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeContextProvider>
    </Provider>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false
})
