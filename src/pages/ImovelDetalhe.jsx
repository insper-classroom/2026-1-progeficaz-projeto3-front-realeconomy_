import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './ImovelDetalhe.css'

function ImovelDetalhe() {
    const { id } = useParams()
    const [imovel, setImovel] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function buscarImovel() {
            try {
                const resposta = await api.get(`/imoveis/${id}`)
                setImovel(resposta.data)
            } catch (err) {
                console.error(err)
                navigate('/')
            }
        }
        buscarImovel()
    }, [id])

    if (!imovel) return <p>Carregando...</p>

    return (
        <div className="detalhe-container">
            <button className="detalhe-voltar" onClick={() => navigate('/')}>
                ← Voltar
            </button>

            <div className="detalhe-card">
                <div className="detalhe-body">
                    <p className="detalhe-tipo">{imovel.tipo_imovel}</p>
                    <h1 className="detalhe-titulo">{imovel.logradouro}, {imovel.numero}</h1>

                    <div className="detalhe-badges">
                        {imovel.tipo_negocio.map(tipo => (
                            <span key={tipo} className="detalhe-badge">{tipo}</span>
                        ))}
                    </div>

                    <hr className="detalhe-divider" />

                    <p className="detalhe-secao-titulo">Endereço</p>
                    <div className="detalhe-endereco">
                        <p>{imovel.logradouro}, {imovel.numero} {imovel.complemento && `— ${imovel.complemento}`}</p>
                        <p>{imovel.bairro}</p>
                        <p>{imovel.cidade}/{imovel.estado} — CEP: {imovel.cep}</p>
                    </div>

                    <hr className="detalhe-divider" />

                    <div className="detalhe-precos">
                        {imovel.preco_venda && (
                            <div className="detalhe-preco-item">
                                <span className="detalhe-preco-label">Venda</span>
                                <span className="detalhe-preco-valor">R$ {imovel.preco_venda.toLocaleString('pt-BR')}</span>
                            </div>
                        )}
                        {imovel.preco_aluguel && (
                            <div className="detalhe-preco-item">
                                <span className="detalhe-preco-label">Aluguel</span>
                                <span className="detalhe-preco-valor">R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}</span>
                            </div>
                        )}
                    </div>

                    {imovel.descricao && (
                        <>
                            <hr className="detalhe-divider" />
                            <p className="detalhe-secao-titulo">Descrição</p>
                            <p className="detalhe-descricao">{imovel.descricao}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImovelDetalhe