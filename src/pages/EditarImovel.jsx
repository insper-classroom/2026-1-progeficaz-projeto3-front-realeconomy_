import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

function EditarImovel() {
    const { id } = useParams()
    const navigate = useNavigate()
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

    const TIPOS_IMOVEL = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara']

    useEffect(() => {
        async function buscarImovel() {
            try {
                const resposta = await api.get(`/imoveis/${id}`)
                const imovel = resposta.data
                setForm({
                    tipo_imovel: imovel.tipo_imovel,
                    tipo_negocio: imovel.tipo_negocio,
                    cep: imovel.cep,
                    numero: imovel.numero,
                    preco_venda: imovel.preco_venda || '',
                    preco_aluguel: imovel.preco_aluguel || '',
                    descricao: imovel.descricao
                })
            } catch (err) {
                console.error(err)
                navigate('/meus-imoveis')
            }
        }
        buscarImovel()
    }, [id])

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

            await api.put(`/imoveis/${id}`, dados)
            navigate('/meus-imoveis')
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao editar imóvel')
        }
    }

    return (
        <div>
            <h1>Editar Imóvel</h1>
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
                    <input type="text" name="cep" value={form.cep} onChange={handleChange} />
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
                <button type="submit">Salvar alterações</button>
                <button type="button" onClick={() => navigate('/meus-imoveis')}>Cancelar</button>
            </form>
        </div>
    )
}

export default EditarImovel