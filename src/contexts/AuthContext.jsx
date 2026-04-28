import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const nome = localStorage.getItem('nome')
        const role = localStorage.getItem('role')
        return nome ? { nome, role } : null
    })

    function login(dados) {
        localStorage.setItem('access_token', dados.access_token)
        localStorage.setItem('refresh_token', dados.refresh_token)
        localStorage.setItem('nome', dados.nome)
        localStorage.setItem('role', dados.role)
        setUsuario({ nome: dados.nome, role: dados.role })
    }

    function logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('nome')
        localStorage.removeItem('role')
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}