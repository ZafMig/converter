import axios, { AxiosError, AxiosResponse } from 'axios'

interface CustomAxiosError extends AxiosError {
  isOffline?: boolean
}

export const apiCurrency = axios.create({
  baseURL: import.meta.env.VITE_EXCHANGERATE_API_KEY,
  timeout: 10000,
})

apiCurrency.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: CustomAxiosError) => {
    if (!navigator.onLine) {
      error.isOffline = true
      error.message = 'No internet connection'
    }
    return Promise.reject(error)
  }
)
