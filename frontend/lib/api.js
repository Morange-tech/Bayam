import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Injecte le token depuis localStorage au démarrage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bayam_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirige vers /connexion si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bayam_token')
      window.location.href = '/connexion'
    }
    return Promise.reject(err)
  }
)

export default api
