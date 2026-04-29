import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './Login.css'


function Login() {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    function mascaraCpf(valor) {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErro('')

        try {
            const cpfLimpo = cpf.replace(/\D/g, '')
            const resposta = await api.post('/auth/login', { cpf: cpfLimpo, senha })
            login(resposta.data)
            navigate('/')
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao fazer login')
        }
    }

    return (
        <div className='login-container'>
            <div className="login-card">
                <h1>Bem-vindo(a)</h1>
                <p className="login-subtitulo">Entre na sua conta para continuar</p>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(mascaraCpf(e.target.value))}
                            placeholder="000.000.000-00"
                            maxLength={14}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Sua senha"
                        />
                    </div>
                    {erro && <p className='erro'>{erro}</p>}
                    <button type="submit" className='btn-primary login-btn'>Entrar</button>
                </form>
                <p className='login-footer'>
                    Não tem conta? <Link to="/register">Cadastre-se</Link>
                </p>
            </div>
        </div>
    )
}

export default Login