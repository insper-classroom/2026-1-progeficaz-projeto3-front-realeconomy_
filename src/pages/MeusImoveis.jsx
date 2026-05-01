import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './MeusImoveis.css'

function MeusImoveis() {
    const [imoveis, setImoveis] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        buscarMeusImoveis()
    }, [])

    async function buscarMeusImoveis() {
        try {
            const resposta = await api.get('/meus-imoveis')
            setImoveis(resposta.data)
        } catch (err) {
            console.error(err)
        }
    }

    async function deletarImovel(id) {
        if (!window.confirm('Tem certeza que deseja excluir este imóvel?')) return
        try {
            await api.delete(`/imoveis/${id}`)
            setImoveis(imoveis.filter(i => i._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="meus-imoveis-container">
            <div className="meus-imoveis-header">
                <h1>Meus Imóveis</h1>
                <button className="btn-primary" onClick={() => navigate('/imoveis/novo')}>
                    + Anunciar imóvel
                </button>
            </div>

            {imoveis.length === 0 ? (
                <p className="meus-imoveis-vazio">Você ainda não tem imóveis anunciados</p>
            ) : (
                <div className="meus-imoveis-lista">
                    {imoveis.map((imovel) => (
                        <div key={imovel._id} className="meu-imovel-card">
                            <div className="meu-imovel-info">
                                <p className="meu-imovel-tipo">{imovel.tipo_imovel}</p>
                                <p className="meu-imovel-titulo">{imovel.logradouro}, {imovel.numero}</p>
                                <p className="meu-imovel-endereco">{imovel.bairro} — {imovel.cidade}/{imovel.estado}</p>
                                <div className="meu-imovel-badges">
                                    {imovel.tipo_negocio.map(tipo => (
                                        <span key={tipo} className="meu-imovel-badge">{tipo}</span>
                                    ))}
                                </div>
                                {imovel.preco_venda && (
                                    <p className="meu-imovel-preco">R$ {imovel.preco_venda.toLocaleString('pt-BR')}</p>
                                )}
                                {imovel.preco_aluguel && (
                                    <p className="meu-imovel-preco">R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}/mês</p>
                                )}
                            </div>
                            <div className="meu-imovel-actions">
                                <button className="btn-secondary" onClick={() => navigate(`/imoveis/${imovel._id}/editar`)}>Editar</button>
                                <button className="btn-danger" onClick={() => deletarImovel(imovel._id)}>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MeusImoveis