import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import './Home.css'

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
        <div className='home-container'>
            <h1 className='home-titulo'>Imóveis disponíveis</h1>


            {/* Filtro cidade */}
            <div className='filtros-grupo'>
                <p className='filtros-titulo'>Cidade:</p>
                <div className="filtros-tags">
                    {cidades.map(cidade => (
                        <button
                            key={cidade._id}
                            className={`tag ${filtros.cidades.includes(cidade.nome) ? 'ativa' : ''}`}
                            onClick={() => toggleFiltro('cidades', cidade.nome)}
                        >
                            {cidade.nome}
                        </button>
                    ))}
                </div>                
            </div>

            {/* Filtro tipo de negócio */}
            <div className='filtro-container'>
                <div className="filtros-grupo">
                        <p className='filtros-titulo'>Tipo de negócio:</p>
                        <div className="filtros-tags">
                            {TIPOS_NEGOCIO.map(tipo => (
                        <button
                            key={tipo}
                            className={`tag ${filtros.tipos_negocio.includes(tipo) ? 'ativa' : ''}`}
                            onClick={() => toggleFiltro('tipos_negocio', tipo)}
                        >
                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </button>
                    ))}
                        </div>
                </div>                
            </div>

            {/* Filtro tipo de imóvel */}
            <div className='filtros-grupo'>
                <p className='filtros-titulo'>Tipo de imóvel:</p>
                <div className="filtros-tags">
                    {TIPOS_IMOVEL.map(tipo => (
                    <button
                        key={tipo}
                        className={`tag ${filtros.tipos_imovel.includes(tipo) ? 'ativa' : ''}`}
                        onClick={() => toggleFiltro('tipos_imovel', tipo)}
                    >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                ))}
                </div>
            </div>

            {/* Filtro preço */}
            <div className="filtros-grupo">
                    <p className="filtros-titulo">Faixa de preço</p>
                    <div className="filtros-preco-valores">
                        <span>R$ {Number(filtros.preco_min).toLocaleString('pt-BR')}</span>
                        <span>R$ {Number(filtros.preco_max).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="filtros-preco">
                        <Slider
                            range
                            min={0}
                            max={5000000}
                            step={50000}
                            value={[filtros.preco_min, filtros.preco_max]}
                            onChange={(valores) => setFiltros({ ...filtros, preco_min: valores[0], preco_max: valores[1] })}
                        />
                    </div>
                </div>

            {/* Cards */}
            <div className="imoveis-grid">
                {imoveis.length === 0 ? (
                    <p className="imoveis-vazio">Nenhum imóvel encontrado</p>
                ) : (
                    imoveis.map((imovel) => (
                        <div key={imovel._id} className="imovel-card" onClick={() => navigate(`/imoveis/${imovel._id}`)}>
                            <div className="imovel-card-body">
                                <p className="imovel-card-tipo">{imovel.tipo_imovel}</p>
                                <h2 className="imovel-card-titulo">{imovel.logradouro}, {imovel.numero}</h2>
                                <p className="imovel-card-endereco">{imovel.bairro} — {imovel.cidade}/{imovel.estado}</p>
                                <div className="imovel-card-negocio">
                                    {imovel.tipo_negocio.map(tipo => (
                                        <span key={tipo} className="imovel-card-badge">{tipo}</span>
                                    ))}
                                </div>
                                {imovel.preco_venda && (
                                    <div>
                                        <p className="imovel-card-preco-label">Venda</p>
                                        <p className="imovel-card-preco">R$ {imovel.preco_venda.toLocaleString('pt-BR')}</p>
                                    </div>
                                )}
                                {imovel.preco_aluguel && (
                                    <div>
                                        <p className="imovel-card-preco-label">Aluguel</p>
                                        <p className="imovel-card-preco">R$ {imovel.preco_aluguel.toLocaleString('pt-BR')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Home