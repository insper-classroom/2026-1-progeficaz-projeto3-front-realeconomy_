import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Home() {
    const [imoveis, setImoveis] = useState([])
    const [filtros, setFiltros] = useState({
        cidade: '',
        tipo_negocio: '',
        tipo_imovel: '',
        preco_min: '',
        preco_max: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        buscarImoveis()
    }, [])

    async function buscarImoveis() {
        try {
            const params = {}
            if (filtros.cidade) params.cidade = filtros.cidade
            if (filtros.tipo_negocio) params.tipo_negocio = filtros.tipo_negocio
            if (filtros.tipo_imovel) params.tipo_imovel = filtros.tipo_imovel
            if (filtros.preco_min) params.preco_min = filtros.preco_min
            if (filtros.preco_max) params.preco_max = filtros.preco_max

            const resposta = await api.get('/imoveis', { params })
            setImoveis(resposta.data)
        } catch (err) {
            console.error(err)
        }
    }

    function handleFiltro(e) {
        setFiltros({ ...filtros, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <h1>Imóveis disponíveis</h1>

            {/* Filtros */}
            <div>
                <input
                    name="cidade"
                    placeholder="Cidade"
                    value={filtros.cidade}
                    onChange={handleFiltro}
                />
                <select name="tipo_negocio" value={filtros.tipo_negocio} onChange={handleFiltro}>
                    <option value="">Tipo de negócio</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                </select>
                <select name="tipo_imovel" value={filtros.tipo_imovel} onChange={handleFiltro}>
                    <option value="">Tipo de imóvel</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                    <option value="chacara">Chácara</option>
                </select>
                <input
                    name="preco_min"
                    placeholder="Preço mínimo"
                    type="number"
                    value={filtros.preco_min}
                    onChange={handleFiltro}
                />
                <input
                    name="preco_max"
                    placeholder="Preço máximo"
                    type="number"
                    value={filtros.preco_max}
                    onChange={handleFiltro}
                />
                <button onClick={buscarImoveis}>Buscar</button>
            </div>

            {/* Cards */}
            <div>
                {imoveis.length === 0 ? (
                    <p>Nenhum imóvel encontrado</p>
                ) : (
                    imoveis.map((imovel) => (
                        <div key={imovel._id} onClick={() => navigate(`/imoveis/${imovel._id}`)}>
                            <h2>{imovel.tipo_imovel}</h2>
                            <p>{imovel.logradouro}, {imovel.numero} — {imovel.cidade}/{imovel.estado}</p>
                            <p>{imovel.tipo_negocio.join(' | ')}</p>
                            {imovel.preco_venda && <p>Venda: R$ {imovel.preco_venda.toLocaleString('pt-BR')}</p>}
                            {imovel.preco_aluguel && <p>Aluguel: R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}</p>}
                            <p>{imovel.bairro}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Home