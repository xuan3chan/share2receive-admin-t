import axios from 'axios'
import router from 'next/router'

export const optionCookie = {
  expires: 1 * 60 * 60 * 1000 // 1 hour
  // sameSite: "Strict",
  // HttpOnly: true,
}

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosClient.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      const accessToken = localStorage.getItem('accessToken') || ''

      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  response => response.data,
  async error => {
    const prevReq = error.config

    if (error.response?.status === 401 && !prevReq._retry) {
      prevReq._retry = true
      try {
        await axiosClient
          .patch('/api/auth/refresh-token')
          .then(res => {
            console.log('res', res.data)
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
          })
          .catch(() => {
            // Logout user clear cookies
            router.replace('/login')
          })

        return axiosClient(prevReq)
      } catch (error) {
        // Logout user
        console.log('error', error)

        return Promise.reject(error)
      }
    }
  }
)

export default axiosClient
