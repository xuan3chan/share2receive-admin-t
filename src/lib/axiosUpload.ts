import router from 'next/router'
import axios from 'axios'

const axiosUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  withCredentials: true
})

axiosUpload.interceptors.request.use(
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

axiosUpload.interceptors.response.use(
  response => response.data,
  async error => {
    const prevReq = error.config

    if (error.response?.status === 401 && !prevReq._retry) {
      prevReq._retry = true
      try {
        await axiosUpload
          .patch('/api/auth/refresh-token')
          .then(res => {
            console.log('res', res.data)
          })
          .catch(() => {
            // Logout user clear cookies
            // Logout user clear cookies
            router.replace('/login')
          })

        return axiosUpload(prevReq)
      } catch (error) {
        // Logout user
        // Logout user
        console.log('error', error)

        return Promise.reject(error)
      }
    }
  }
)

export default axiosUpload
