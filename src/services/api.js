import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

// Adiciona o access_token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepta respostas 401 e tenta renovar o token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                const resposta = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                })

                const novoToken = resposta.data.access_token
                localStorage.setItem('access_token', novoToken)
                original.headers.Authorization = `Bearer ${novoToken}`
                return api(original)
            } catch {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api