import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import Router from 'next/router'
import { deleteCookie, getCookie } from '../utils/cookie'
import COOKIE_KEY from '../shared/cookie-key'

class MainAxios {
  private static instance: AxiosInstance

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */

  // eslint-disable-next-line
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */

  public static getInstance(
    config: AxiosRequestConfig<any> | undefined
  ): AxiosInstance {
    if (!MainAxios.instance) {
      MainAxios.instance = axios.create(config)
    }

    return MainAxios.instance
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  public someBusinessLogic() {
    // ...
  }
}

const mainAxios = MainAxios.getInstance({
  // baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

mainAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (
      config &&
      config?.headers &&
      typeof window !== 'undefined' &&
      getCookie(COOKIE_KEY.TOKEN)
    ) {
      config.headers.Authorization = `Bearer ${getCookie(COOKIE_KEY.TOKEN)}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

mainAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response?.data) {
      return response.data
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // window.location.href = `/`;
      deleteCookie(COOKIE_KEY.TOKEN)
      Router.push('/')
    }
    return Promise.reject(error)
  }
)

export default mainAxios
