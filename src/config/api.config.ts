import axios from 'axios'
import { BASE_URL } from './constant'
import { getCurrentUserAndAccessToken } from '@/lib/localStorage'

const handleUnauthorizedAccess = () => {
  localStorage.clear()
  window.history.replaceState({}, '', '/session-expire')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const makeRequest = axios.create({
  baseURL: BASE_URL,
})

makeRequest.interceptors.request.use(
  (config) => {
    const { user, accessToken } = getCurrentUserAndAccessToken()

    if (user && accessToken) {
      config.headers.Authorization = accessToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

makeRequest.interceptors.response.use(
  (res) => {
    return res.data
  },

  (error) => {
    if (error?.response?.status === 401) {
      handleUnauthorizedAccess()
    }

    const myerror = {
      statusCode: error.response?.status,
      statusText: error.response?.statusText,
      message:
        error.response?.data?.error?.message ||
        error?.message ||
        'something went wrong',
    }
    return Promise.reject(myerror)
  }
)

export { makeRequest }
