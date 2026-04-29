import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

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
        <div>
            <button onClick={() => navigate('/')}>← Voltar</button>
            <h1>{imovel.tipo_imovel}</h1>
            <p>{imovel.logradouro}, {imovel.numero} — {imovel.bairro}</p>
            <p>{imovel.cidade}/{imovel.estado} — CEP: {imovel.cep}</p>
            <p>{imovel.tipo_negocio.join(' | ')}</p>
            {imovel.preco_venda && <p>Venda: R$ {imovel.preco_venda.toLocaleString('pt-BR')}</p>}
            {imovel.preco_aluguel && <p>Aluguel: R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}</p>}
            <p>{imovel.descricao}</p>
        </div>
    )
}

export default ImovelDetalhe