import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ImovelDetalhe from './pages/ImovelDetalhe'
import NovoImovel from './pages/NovoImovel'
import MeusImoveis from './pages/MeusImoveis'
import EditarImovel from './pages/EditarImovel'
import RotaPrivada from './components/RotaPrivada'

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/meus-imoveis" element={<RotaPrivada><MeusImoveis /></RotaPrivada>} />
                <Route path="/imoveis/novo" element={<RotaPrivada><NovoImovel /></RotaPrivada>} />
                <Route path="/imoveis/:id/editar" element={<RotaPrivada><EditarImovel /></RotaPrivada>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App