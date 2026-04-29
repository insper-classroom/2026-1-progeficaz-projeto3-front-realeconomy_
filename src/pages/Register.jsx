import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Register.css'


function Register() {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
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
        setSucesso('')

        try {
            const cpfLimpo = cpf.replace(/\D/g, '')
            await api.post('/auth/register', { nome, cpf: cpfLimpo, senha })
            setSucesso('Cadastro realizado com sucesso!')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar')
        }
    }

    return (
        <div className='register-container'>
            <div className="register-card">
                <h1>Criar conta</h1>
                <p className="register-subtitulo">Preencha os dados para se cadastrar</p>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Nome completo</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome completo"
                        />
                    </div>
                    <div className='form-group'>
                        <label>CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(mascaraCpf(e.target.value))}
                            placeholder="000.000.000-00"
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
                    {erro && <p>{erro}</p>}
                    {sucesso && <p>{sucesso}</p>}
                    <button type="submit" className="btn-primary register-btn">Cadastrar</button>
            </form>
            <p className="register-footer">
                Já tem conta? <Link to="/login">Entrar</Link>
            </p>
            </div>
        </div>
    )
}

export default Register