import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/imoveis/:id" element={<div>Detalhe</div>} />
                <Route path="/login" element={<div>Login</div>} />
                <Route path="/register" element={<div>Cadastro</div>} />
                <Route path="/meus-imoveis" element={<div>Meus Imóveis</div>} />
                <Route path="/imoveis/novo" element={<div>Novo Imóvel</div>} />
                <Route path="/imoveis/:id/editar" element={<div>Editar Imóvel</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App