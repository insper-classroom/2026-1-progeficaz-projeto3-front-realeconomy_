import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

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
    const navigate = useNavigate()

    const TIPOS_IMOVEL = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara']

    async function handleCep(e) {
        const cep = e.target.value.replace(/\D/g, '')
        setForm(prev => ({ ...prev, cep: e.target.value }))

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
                descricao: form.descricao
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
        <div>
            <h1>Anunciar Imóvel</h1>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Tipo de Imóvel</label>
                    <select name="tipo_imovel" value={form.tipo_imovel} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {TIPOS_IMOVEL.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Tipo de Negócio</label>
                    {['venda', 'aluguel'].map(tipo => (
                        <button
                            key={tipo}
                            type="button"
                            onClick={() => handleTipoNegocio(tipo)}
                            style={{ fontWeight: form.tipo_negocio.includes(tipo) ? 'bold' : 'normal' }}
                        >
                            {tipo}
                        </button>
                    ))}
                </div>

                {form.tipo_negocio.includes('venda') && (
                    <div>
                        <label>Preço de Venda</label>
                        <input type="number" name="preco_venda" value={form.preco_venda} onChange={handleChange} />
                    </div>
                )}

                {form.tipo_negocio.includes('aluguel') && (
                    <div>
                        <label>Preço de Aluguel</label>
                        <input type="number" name="preco_aluguel" value={form.preco_aluguel} onChange={handleChange} />
                    </div>
                )}

                <div>
                    <label>CEP</label>
                    <input
                        type="text"
                        name="cep"
                        value={form.cep}
                        onChange={handleCep}
                        placeholder="00000-000"
                        maxLength={9}
                    />
                    {buscandoCep && <span>Buscando CEP...</span>}
                </div>

                <div>
                    <label>Estado</label>
                    <input type="text" value={form.estado} disabled />
                </div>

                <div>
                    <label>Cidade</label>
                    <input type="text" value={form.cidade} disabled />
                </div>

                <div>
                    <label>Bairro</label>
                    <input type="text" name="bairro" value={form.bairro} onChange={handleChange} />
                </div>

                <div>
                    <label>Logradouro</label>
                    <input type="text" name="logradouro" value={form.logradouro} onChange={handleChange} />
                </div>

                <div>
                    <label>Número</label>
                    <input type="text" name="numero" value={form.numero} onChange={handleChange} />
                </div>

                <div>
                    <label>Complemento</label>
                    <input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Apto, casa, etc." />
                </div>

                <div>
                    <label>Descrição</label>
                    <textarea name="descricao" value={form.descricao} onChange={handleChange} />
                </div>

                {erro && <p>{erro}</p>}
                <button type="submit">Anunciar</button>
            </form>
        </div>
    )
}

export default NovoImovel