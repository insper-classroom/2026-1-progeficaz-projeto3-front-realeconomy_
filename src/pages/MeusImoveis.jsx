import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

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
        <div>
            <h1>Meus Imóveis</h1>
            <button onClick={() => navigate('/imoveis/novo')}>Anunciar novo imóvel</button>

            {imoveis.length === 0 ? (
                <p>Você ainda não tem imóveis anunciados</p>
            ) : (
                imoveis.map((imovel) => (
                    <div key={imovel._id}>
                        <h2>{imovel.tipo_imovel}</h2>
                        <p>{imovel.logradouro}, {imovel.numero} — {imovel.cidade}/{imovel.estado}</p>
                        <p>{imovel.tipo_negocio.join(' | ')}</p>
                        {imovel.preco_venda && <p>Venda: R$ {imovel.preco_venda.toLocaleString('pt-BR')}</p>}
                        {imovel.preco_aluguel && <p>Aluguel: R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}</p>}
                        <button onClick={() => navigate(`/imoveis/${imovel._id}/editar`)}>Editar</button>
                        <button onClick={() => deletarImovel(imovel._id)}>Excluir</button>
                    </div>
                ))
            )}
        </div>
    )
}

export default MeusImoveis