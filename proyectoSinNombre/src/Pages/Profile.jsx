import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../Componets/Post.jsx';
import './Profile.css';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogReportRef = useRef(null);
    const { user: loggedInUser, getUserProfile } = useAuth(); // Usuario autenticado
    const { username } = useParams(); // Obtener el username de la URL
    const [profileUser, setProfileUser] = useState(null); // Usuario del perfil
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile(username); // No necesitas response.json() con axios
                setProfileUser(response);
                console.log(profileUser); // Accede a los datos con response.data
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    },[]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleReport = (option) => {
        console.log(`Reportado por: ${option}`);
        setIsOpen(false);
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const showDialog = () => {
        if (dialogReportRef.current) {
            if (!dialogReportRef.current.open) {
                dialogReportRef.current.showModal();
            } else {
                dialogReportRef.current.close();
            }
        }
    };

    if (loading) {
        return <div>Cargando perfil...</div>; // Mostrar cargando mientras se obtienen los datos
    }

    if (!profileUser) {
        return <div>No se encontró el perfil del usuario.</div>; // Mostrar mensaje si no se encuentra el usuario
    }

    return (
        <>
            <div className="main">
                <div className="profile">
                    <section className="aboutme">
                        <div>
                            <img src="src/assets/user.png" alt="fotoPerfil" />
                            <p>{profileUser.fullName ?? 'N/A'}</p>
                        </div>
                        {loggedInUser?.userName !== profileUser.userName && ( // Solo mostrar opciones si el usuario autenticado no es el dueño del perfil
                            <div style={{ width: '10%', marginLeft: '90%' }} className="report-dropdown">
                                <button className="report-button" onClick={toggleMenu}>
                                    <i style={{ fontSize: '35px', overflowY: 'hidden' }} className="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                            </div>
                        )}
                        {isOpen && (
                            <ul className="report-menu2">
                                <li className="report-item" onClick={() => handleReport('Contenido inapropiado')}>
                                    <i className="fa-solid fa-ban"></i>Suspender Usuario
                                </li>
                                <li className="report-item" onClick={showDialog}>
                                    <i className="fa-solid fa-flag"></i>Reportar Usuario
                                </li>
                                <li className="report-item" onClick={() => handleReport('Otro')}>Otro</li>
                                <li className="report-item" onClick={toggleMenu}>
                                    <i className="fa-solid fa-x"></i> Cerrar
                                </li>
                            </ul>
                        )}

                        <dialog ref={dialogReportRef} className="dialogPost dialogReport">
                            <h3>Reportar</h3>
                            <div className="sub">
                                <form method="dialog" className="formPost">
                                    <p>Selecciona un motivo:</p>
                                    <p>
                                        <label>
                                            <input type="checkbox" name="motivo" value="spam" />
                                            Spam
                                        </label>
                                    </p>
                                    <p>
                                        <label>
                                            <input type="checkbox" name="motivo" value="contenido_inapropiado" />
                                            Contenido inapropiado
                                        </label>
                                    </p>
                                    <p>
                                        <label>
                                            <input type="checkbox" name="motivo" value="acoso" />
                                            Acoso
                                        </label>
                                    </p>
                                    <p>
                                        <label>
                                            <input type="checkbox" name="motivo" value="otro" />
                                            Otro
                                        </label>
                                    </p>

                                    <p>
                                        <label>Descripción (Opcional):</label>
                                        <textarea name="descripcion" id="descripcion" onChange={autoResize}></textarea>
                                    </p>
                                </form>
                            </div>

                            <div className="botones">
                                <button style={{ background: '#1d8348' }} onClick={showDialog}>Reportar</button>
                                <button style={{ background: '#DE2D18' }} onClick={showDialog}>Cancelar</button>
                            </div>
                        </dialog>
                    </section>

                    <section className="mycontent">
                        <div className="skills">
                            <div className="cloud" style={{ border: '3px solid #2ecc71' }}>
                                <p>Información Personal</p>
                                <div>
                                    <p>Edad: {profileUser.edad ?? 'N/A'} Años</p>
                                    <p>Fecha de Nacimiento: {profileUser.birthDate ?? 'N/A'}</p>
                                    <p>Ciudad Origen: {profileUser.lugarOrigen?.nombreMunicipio ?? 'N/A'}, {profileUser.lugarOrigen?.nombreDepartamento ?? 'N/A'}</p>
                                    <p>Carrera: {profileUser.profession ?? 'N/A'}</p>
                                </div>
                            </div>
                            <div className="cloud" style={{ border: '3px solid #27ae60' }}>
                                <p>Habilidades</p>
                                <div>
                                    <p>{profileUser.skills ?? 'No se han agregado habilidades'}</p>
                                </div>
                            </div>
                            <div className="cloud" style={{ border: '3px solid #27ae60' }}>
                                <p>Descripción</p>
                                <div>
                                    <p>{profileUser.description ?? 'El usuario no ha agregado una descripción'}</p>
                                </div>
                            </div>
                            <div className="cloud" style={{ border: '3px solid #2ecc71' }}>
                                <p>Contacto</p>
                                <div>
                                    <p>Email: {profileUser.email ?? 'N/A'}</p>
                                    <p>Teléfono: {profileUser.phone ?? 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="myPost">
                            <h2>Trabajos destacados</h2>
                            <div>
                                {/** Aquí irían los posts del usuario, puedes hacer otra solicitud para obtenerlos */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Profile;
