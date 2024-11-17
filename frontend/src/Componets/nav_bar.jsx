import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const NavBar = () => {
    const { isAuthenticated, user, logOut } = useAuth();
    const [userLink, setUserLink] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setUserLink(user?.id);
    }, [isAuthenticated, user, setUserLink]);

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            await logOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };

    const navegar = (e) => {
        e.preventDefault();
        navigate(`/profile/${userLink}`);
    }

    return (
        <header>
            <div className="container">
                <div className="navBar">

                    {!isAuthenticated ? (
                        <>
                            <div className="logo">
                                <Link to="/"><img src="src/assets/LogoUnicesArt.png" alt="Logo UnicesArt" /></Link>
                            </div>
                            <div className="container2">
                                <div className="enlaces">
                                    <ul>
                                        <li><Link to="/home">Continuar sin Registrarse</Link></li>
                                        <li className='singup'><Link to="/singup">Registrarse</Link></li>
                                        <li className='singin'><Link to="/singin">Iniciar Sesión</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="hamburguesa">

                            </div>
                        </>
                    ) : (
                        <>
                            <div className="usuario">
                                <i className="fa-solid fa-user"></i>
                                <button onClick={navegar}>
                                    {user?.fullName}
                                </button>

                            </div>
                            <div className="search">
                                <input type="text" placeholder="Buscar usuarios..." />
                                <button onClick={() => navigate('/results')} className="fa-solid fa-magnifying-glass"></button>
                            </div>
                            <div className="enlaces-dash">
                                <ul>
                                    <li>
                                        <Link to="/home"><div>
                                            <i className="fa-solid fa-house"></i>
                                            <p>Inicio</p></div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/configuration">
                                            <div>
                                                <i className="fa-solid fa-gear"></i>
                                                <p>Configuración</p>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogOut} style={{ background: '#fff', color: '#000' }}>
                                            <div>
                                                <i className="fa-solid fa-right-from-bracket"></i>
                                                <p>Cerrar Sesión</p>
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="hamburguesa">

                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
