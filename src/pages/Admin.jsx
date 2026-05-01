import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './Admin.css'

const ESTADOS = [
    { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' }, { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' }, { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' }, { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' }, { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' }
]

function Admin() {
    const { usuario } = useAuth()
    const navigate = useNavigate()
    const [cidades, setCidades] = useState([])
    const [cidadesIBGE, setCidadesIBGE] = useState([])
    const [estadoSelecionado, setEstadoSelecionado] = useState('')
    const [cidadeSelecionada, setCidadeSelecionada] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [buscando, setBuscando] = useState(false)

    useEffect(() => {
        if (!usuario || usuario.role !== 'admin') {
            navigate('/')
        }
        buscarCidades()
    }, [])

    async function buscarCidades() {
        try {
            const resposta = await api.get('/cidades')
            setCidades(resposta.data)
        } catch (err) {
            console.error(err)
        }
    }

    async function buscarCidadesIBGE(uf) {
        setEstadoSelecionado(uf)
        setCidadeSelecionada('')
        setCidadesIBGE([])
        if (!uf) return

        setBuscando(true)
        try {
            const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            const dados = await resposta.json()
            setCidadesIBGE(dados.sort((a, b) => a.nome.localeCompare(b.nome)))
        } catch {
            setErro('Erro ao buscar cidades do IBGE')
        } finally {
            setBuscando(false)
        }
    }

    async function handleAdicionarCidade(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')

        if (!cidadeSelecionada || !estadoSelecionado) {
            setErro('Selecione um estado e uma cidade')
            return
        }

        try {
            await api.post('/cidades', { nome: cidadeSelecionada, estado: estadoSelecionado })
            setSucesso('Cidade adicionada com sucesso!')
            setCidadeSelecionada('')
            setEstadoSelecionado('')
            setCidadesIBGE([])
            buscarCidades()
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao adicionar cidade')
        }
    }

    async function handleDeletarCidade(id) {
        if (!window.confirm('Tem certeza que deseja remover esta cidade?')) return
        try {
            await api.delete(`/cidades/${id}`)
            setCidades(cidades.filter(c => c._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

        return (
        <div className="admin-container">
            <h1>Painel Admin</h1>

            <div className="admin-secao">
                <h2>Adicionar Cidade</h2>
                <form onSubmit={handleAdicionarCidade}>
                    <div className="admin-form">
                        <div className="form-group">
                            <label>Estado</label>
                            <select value={estadoSelecionado} onChange={(e) => buscarCidadesIBGE(e.target.value)}>
                                <option value="">Selecione um estado</option>
                                {ESTADOS.map(e => (
                                    <option key={e.uf} value={e.uf}>{e.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Cidade</label>
                            <select value={cidadeSelecionada} onChange={(e) => setCidadeSelecionada(e.target.value)} disabled={cidadesIBGE.length === 0}>
                                <option value="">{buscando ? 'Buscando...' : 'Selecione uma cidade'}</option>
                                {cidadesIBGE.map(c => (
                                    <option key={c.id} value={c.nome}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary">Adicionar</button>
                    </div>
                    {erro && <p className="erro">{erro}</p>}
                    {sucesso && <p className="sucesso">{sucesso}</p>}
                </form>

                <h3>Cidades cadastradas</h3>
                {cidades.length === 0 ? (
                    <p className="admin-vazio">Nenhuma cidade cadastrada</p>
                ) : (
                    <div className="admin-cidades-lista">
                        {cidades.map(cidade => (
                            <div key={cidade._id} className="admin-cidade-item">
                                <span>
                                    <span className="admin-cidade-nome">{cidade.nome}</span>
                                    <span className="admin-cidade-uf">— {cidade.estado}</span>
                                </span>
                                <button className="btn-danger" onClick={() => handleDeletarCidade(cidade._id)}>Remover</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin