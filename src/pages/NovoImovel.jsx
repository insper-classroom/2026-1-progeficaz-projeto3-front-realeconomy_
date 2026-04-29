import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function NovoImovel() {
    const [form, setForm] = useState({
        tipo_imovel: '',
        tipo_negocio: [],
        cep: '',
        numero: '',
        preco_venda: '',
        preco_aluguel: '',
        descricao: ''
    })
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    const TIPOS_IMOVEL = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara']

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
                numero: form.numero,
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
                    <button type="button" onClick={() => handleTipoNegocio('venda')}
                        style={{ fontWeight: form.tipo_negocio.includes('venda') ? 'bold' : 'normal' }}>
                        Venda
                    </button>
                    <button type="button" onClick={() => handleTipoNegocio('aluguel')}
                        style={{ fontWeight: form.tipo_negocio.includes('aluguel') ? 'bold' : 'normal' }}>
                        Aluguel
                    </button>
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
                    <input type="text" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" />
                </div>

                <div>
                    <label>Número</label>
                    <input type="text" name="numero" value={form.numero} onChange={handleChange} />
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