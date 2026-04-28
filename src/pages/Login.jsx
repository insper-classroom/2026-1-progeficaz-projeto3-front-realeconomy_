import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function Login() {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setErro('')

        try {
            const resposta = await api.post('/auth/login', { cpf, senha })
            login(resposta.data)
            navigate('/')
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao fazer login')
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>CPF</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                    />
                </div>
                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Sua senha"
                    />
                </div>
                {erro && <p>{erro}</p>}
                <button type="submit">Entrar</button>
            </form>
            <p>Não tem conta? <Link to="/register">Cadastre-se</Link></p>
        </div>
    )
}

export default Login