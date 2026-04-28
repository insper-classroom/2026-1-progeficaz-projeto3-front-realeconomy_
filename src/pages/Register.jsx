import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Register() {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')

        try {
            await api.post('/auth/register', { nome, cpf, senha })
            setSucesso('Cadastro realizado com sucesso!')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar')
        }
    }

    return (
        <div>
            <h1>Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome completo"
                    />
                </div>
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
                {sucesso && <p>{sucesso}</p>}
                <button type="submit">Cadastrar</button>
            </form>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </div>
    )
}

export default Register