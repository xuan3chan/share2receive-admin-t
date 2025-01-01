// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axiosClient from 'src/lib/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import Cookies from 'js-cookie'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      setLoading(true)
      await axiosClient
        .get(authConfig.meEndpoint)
        .then(async response => {
          setLoading(false)
          setUser({ ...response.data })
          localStorage.setItem('userData', JSON.stringify(response.data))
        })
        .catch(() => {
          setUser(null)
          localStorage.removeItem('userData')
          router.replace('/login')
        })
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axiosClient
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        window.localStorage.setItem('userData', JSON.stringify(response.data.user))

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = async () => {
    setUser(null)
    setTimeout(() => {
      window.localStorage.clear()
    }, 500)

    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')

    await axiosClient.patch(authConfig.logoutEndpoint).then(() => {
      localStorage.clear()
      router.push('/login')
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
