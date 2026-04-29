import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

function Home() {
    const [imoveis, setImoveis] = useState([])
    const [cidades, setCidades] = useState([])
    const [filtros, setFiltros] = useState({
        cidades: [],
        tipos_negocio: [],
        tipos_imovel: [],
        preco_min: 0,
        preco_max: 5000000
    })
    const navigate = useNavigate()

    const TIPOS_NEGOCIO = ['venda', 'aluguel']
    const TIPOS_IMOVEL = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara']

    useEffect(() => {
        buscarCidades()
    }, [])

    useEffect(() => {
        buscarImoveis(filtros)
    }, [filtros])

    async function buscarCidades() {
        try {
            const resposta = await api.get('/cidades')
            setCidades(resposta.data)
        } catch (err) {
            console.error(err)
        }
    }

    async function buscarImoveis(filtrosAtuais) {
        try {
            const params = {}
            if (filtrosAtuais.cidades.length > 0) params.cidade = filtrosAtuais.cidades.join(',')
            if (filtrosAtuais.tipos_negocio.length > 0) params.tipo_negocio = filtrosAtuais.tipos_negocio.join(',')
            if (filtrosAtuais.tipos_imovel.length > 0) params.tipo_imovel = filtrosAtuais.tipos_imovel.join(',')
            if (filtrosAtuais.preco_min > 0) params.preco_min = filtrosAtuais.preco_min
            if (filtrosAtuais.preco_max < 5000000) params.preco_max = filtrosAtuais.preco_max

            console.log('Filtros enviados:', params)

            const resposta = await api.get('/imoveis', { params })
            setImoveis(resposta.data)
        } catch (err) {
            console.error(err)
        }
    }

    function toggleFiltro(campo, valor) {
        setFiltros(prev => {
            const lista = prev[campo].includes(valor)
                ? prev[campo].filter(v => v !== valor)
                : [...prev[campo], valor]
            return { ...prev, [campo]: lista }
        })
    }

    return (
        <div>
            <h1>Imóveis disponíveis</h1>

            {/* Filtro tipo de negócio */}
            <div>
                <p>Tipo de negócio:</p>
                {TIPOS_NEGOCIO.map(tipo => (
                    <button
                        key={tipo}
                        onClick={() => toggleFiltro('tipos_negocio', tipo)}
                        style={{ fontWeight: filtros.tipos_negocio.includes(tipo) ? 'bold' : 'normal' }}
                    >
                        {tipo}
                    </button>
                ))}
            </div>

            {/* Filtro tipo de imóvel */}
            <div>
                <p>Tipo de imóvel:</p>
                {TIPOS_IMOVEL.map(tipo => (
                    <button
                        key={tipo}
                        onClick={() => toggleFiltro('tipos_imovel', tipo)}
                        style={{ fontWeight: filtros.tipos_imovel.includes(tipo) ? 'bold' : 'normal' }}
                    >
                        {tipo}
                    </button>
                ))}
            </div>

            {/* Filtro cidade */}
            <div>
                <p>Cidade:</p>
                {cidades.map(cidade => (
                    <button
                        key={cidade._id}
                        onClick={() => toggleFiltro('cidades', cidade.nome)}
                        style={{ fontWeight: filtros.cidades.includes(cidade.nome) ? 'bold' : 'normal' }}
                    >
                        {cidade.nome}
                    </button>
                ))}
            </div>

            {/* Filtro preço */}
            <div>
                <p>Preço: R$ {Number(filtros.preco_min).toLocaleString('pt-BR')} — R$ {Number(filtros.preco_max).toLocaleString('pt-BR')}</p>
                <Slider
                    range
                    min={0}
                    max={5000000}
                    step={50000}
                    value={[filtros.preco_min, filtros.preco_max]}
                    onChange={(valores) => setFiltros({ ...filtros, preco_min: valores[0], preco_max: valores[1] })}
                />
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