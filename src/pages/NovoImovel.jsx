import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './NovoImovel.css'

function NovoImovel() {
    const [form, setForm] = useState({
        tipo_imovel: '',
        tipo_negocio: [],
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        preco_venda: '',
        preco_aluguel: '',
        descricao: ''
    })
    const [erro, setErro] = useState('')
    const [buscandoCep, setBuscandoCep] = useState(false)
    const [cidadesDisponiveis, setCidadesDisponiveis] = useState([])
    const [cidadeValida, setCidadeValida] = useState(null)
    const navigate = useNavigate()
    const [imagens, setImagens] = useState([])
    const [uploadando, setUploadando] = useState(false)

    
    async function handleImagens(e) {
    const arquivos = Array.from(e.target.files)
    setUploadando(true)

        try {
            const urls = []
            for (const arquivo of arquivos) {
                const formData = new FormData()
                formData.append('imagem', arquivo)

                const resposta = await api.post('/imagens', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                urls.push(resposta.data.url)
            }
            setImagens(prev => [...prev, ...urls])
        } catch (err) {
            setErro('Erro ao fazer upload das imagens')
        } finally {
            setUploadando(false)
        }
    }


    const TIPOS_IMOVEL = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara']

    useEffect(() => {
        async function buscarCidades() {
            try {
                const resposta = await api.get('/cidades')
                setCidadesDisponiveis(resposta.data)
            } catch (err) {
                console.error(err)
            }
        }
        buscarCidades()
    }, [])

    async function handleCep(e) {
        const cep = e.target.value.replace(/\D/g, '')
        setForm(prev => ({ ...prev, cep: e.target.value }))
        setCidadeValida(null)

        if (cep.length === 8) {
            setBuscandoCep(true)
            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const dados = await resposta.json()
                if (!dados.erro) {
                    setForm(prev => ({
                        ...prev,
                        logradouro: dados.logradouro || '',
                        bairro: dados.bairro || '',
                        cidade: dados.localidade || '',
                        estado: dados.uf || ''
                    }))

                    const valida = cidadesDisponiveis.some(
                        c => c.nome.toLowerCase() === dados.localidade.toLowerCase()
                    )
                    setCidadeValida(valida)

                    if (!valida) {
                        setErro(`A cidade ${dados.localidade} não está disponível para anúncios`)
                    } else {
                        setErro('')
                    }
                } else {
                    setErro('CEP não encontrado')
                }
            } catch {
                setErro('Erro ao buscar CEP')
            } finally {
                setBuscandoCep(false)
            }
        }
    }

    function handleTipoNegocio(tipo) {
        setForm(prev => {
            const tipos = prev.tipo_negocio.includes(tipo)
                ? prev.tipo_negocio.filter(t => t !== tipo)
                : [...prev.tipo_negocio, tipo]
            return { ...prev, tipo_negocio: tipos }
        })
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErro('')

        if (!cidadeValida) {
            setErro('Cidade não disponível para anúncios')
            return
        }

        if (form.tipo_negocio.length === 0) {
            setErro('Selecione pelo menos um tipo de negócio')
            return
        }

        try {
            const dados = {
                tipo_imovel: form.tipo_imovel,
                tipo_negocio: form.tipo_negocio,
                cep: form.cep,
                logradouro: form.logradouro,
                numero: form.numero,
                complemento: form.complemento,
                bairro: form.bairro,
                cidade: form.cidade,
                estado: form.estado,
                descricao: form.descricao,
                imagens: imagens
            }
            if (form.tipo_negocio.includes('venda')) dados.preco_venda = parseFloat(form.preco_venda)
            if (form.tipo_negocio.includes('aluguel')) dados.preco_aluguel = parseFloat(form.preco_aluguel)

        

            await api.post('/imoveis', dados)
            navigate('/meus-imoveis')
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar imóvel')
        }
    }

    return (
        <div className="novo-imovel-container">
            <h1>Anunciar Imóvel</h1>

            <div className="cidades-disponiveis">
                <p>Cidades disponíveis para anúncios</p>
                <div className="cidades-tags">
                    {cidadesDisponiveis.map(cidade => (
                        <span key={cidade._id} className="cidade-tag">
                            {cidade.nome} — {cidade.estado}
                        </span>
                    ))}
                </div>
            </div>

            

            <div className="novo-imovel-card">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Tipo de Imóvel</label>
                        <select name="tipo_imovel" value={form.tipo_imovel} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {TIPOS_IMOVEL.map(t => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                    </div>



                <div className="form-group">
                <label>Imagens</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagens}
                />
                    {uploadando && <span className="cep-feedback cep-buscando">Enviando imagens...</span>}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {imagens.map((url, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img
                                    src={url}
                                    alt="preview"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setImagens(imagens.filter((_, i) => i !== index))}
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-6px',
                                        background: 'var(--erro)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>


                    <div className="form-group">
                        <label>Tipo de Negócio</label>
                        <div className="tipo-negocio-tags">
                            {['venda', 'aluguel'].map(tipo => (
                                <button
                                    key={tipo}
                                    type="button"
                                    className={`tag ${form.tipo_negocio.includes(tipo) ? 'ativa' : ''}`}
                                    onClick={() => handleTipoNegocio(tipo)}
                                >
                                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.tipo_negocio.includes('venda') && (
                        <div className="form-group">
                            <label>Preço de Venda</label>
                            <input type="number" name="preco_venda" value={form.preco_venda} onChange={handleChange} placeholder="R$ 0,00" />
                        </div>
                    )}

                    {form.tipo_negocio.includes('aluguel') && (
                        <div className="form-group">
                            <label>Preço de Aluguel</label>
                            <input type="number" name="preco_aluguel" value={form.preco_aluguel} onChange={handleChange} placeholder="R$ 0,00" />
                        </div>
                    )}

                    <div className="form-group">
                        <label>CEP</label>
                        <input
                            type="text"
                            name="cep"
                            value={form.cep}
                            onChange={handleCep}
                            placeholder="00000-000"
                            maxLength={9}
                        />
                        {buscandoCep && <span className="cep-feedback cep-buscando">Buscando CEP...</span>}
                        {cidadeValida === true && <span className="cep-feedback cep-valido">✅ Cidade disponível!</span>}
                        {cidadeValida === false && <span className="cep-feedback cep-invalido">❌ Cidade não disponível</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Cidade</label>
                            <input type="text" value={form.cidade} disabled />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <input type="text" value={form.estado} disabled />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Logradouro</label>
                        <input type="text" name="logradouro" value={form.logradouro} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Número</label>
                            <input type="text" name="numero" value={form.numero} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Complemento</label>
                            <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Apto, casa, etc." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Bairro</label>
                        <input type="text" name="bairro" value={form.bairro} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea name="descricao" value={form.descricao} onChange={handleChange} />
                    </div>

                    {erro && <p className="erro">{erro}</p>}

                    <div className="novo-imovel-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/meus-imoveis')}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={cidadeValida === false}>Anunciar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NovoImovel