import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <nav>
            <Link to="/">RealEconomy</Link>
            <div>
                {usuario ? (
                    <>
                        <span>Olá, {usuario.nome}</span>
                        <Link to="/meus-imoveis">Meus Imóveis</Link>
                        <Link to="/imoveis/novo">Anunciar</Link>
                        {usuario.role === 'admin' && (
                            <Link to="/admin">Admin</Link>
                        )}
                        <button onClick={handleLogout}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Entrar</Link>
                        <Link to="/register">Cadastrar</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar