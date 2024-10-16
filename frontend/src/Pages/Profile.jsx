import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../Componets/Post.jsx';
import './Profile.css';
import { useAuth } from '../context/AuthContext.jsx';
import { usePost } from '../context/PostContext.jsx';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogReportRef = useRef(null);
    const { user: loggedInUser, getUserProfile } = useAuth();
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getPost, publicaciones } = usePost();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setProfileUser(null); 
    
            try {
                const userProfile = await getUserProfile(username);
                if (userProfile) {
                    setProfileUser(userProfile);
                    await getPost(userProfile.id, userProfile.username);  
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserProfile();
    }, [username, getUserProfile, getPost]);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleReport = () => {
        setIsOpen(false);  // Close the menu after reporting
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';  // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`;  // Adjust to content
    };

    const showDialog = () => {
        if (dialogReportRef.current) {
            dialogReportRef.current.open
                ? dialogReportRef.current.close()
                : dialogReportRef.current.showModal();
        }
    };

    // If profile is loading
    if (loading) {
        return <div style={{ height: '120px' }}>Cargando perfil...</div>;
    }

    // If profile is not found
    if (!profileUser) {
        return <div>No se encontró el perfil del usuario.</div>;
    }

    return (
        <div className="main">
            <div className="profile">
                <section className="aboutme">
                    <div>
                        <img src="..\src\assets\profileUser.png" alt="fotoPerfil" />
                        <p>{profileUser.fullName ?? 'N/A'}</p>
                    </div>
                    {loggedInUser?.username !== profileUser.username && (
                        <div style={{ marginLeft: '85%' }} className="report-dropdown">
                            <button className="report-button" onClick={toggleMenu}>
                                <i style={{ color: 'white', fontSize: '25px' }} className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                    )}
                    {isOpen && (
                        <ul className="report-menu2">
                            <li>
                                <button className="report-item" onClick={() => handleReport('Contenido inapropiado')}>
                                    <i className="fa-solid fa-ban"></i>Suspender Usuario
                                </button>
                            </li>
                            <li>
                                <button className="report-item" onClick={showDialog}>
                                    <i className="fa-solid fa-flag"></i>Reportar Usuario
                                </button>
                            </li>
                            <li>
                                <button className="report-item" onClick={() => handleReport('Otro')}>
                                    Otro
                                </button>
                            </li>
                            <li>
                                <button className="report-item" onClick={toggleMenu}>
                                    <i className="fa-solid fa-x"></i> Cerrar
                                </button>
                            </li>
                        </ul>
                    )}

                    <dialog ref={dialogReportRef} className="dialogPost dialogReport">
                        <h3>Reportar</h3>
                        <div className="sub">
                            <form method="dialog" className="formPost">
                                <p>Selecciona un motivo:</p>
                                <p>
                                    <input type="checkbox" name="motivo" value="spam" />
                                    Spam
                                </p>
                                <p>
                                    <input type="checkbox" name="motivo" value="contenido_inapropiado" />
                                    Contenido inapropiado
                                </p>
                                <p>
                                    <input type="checkbox" name="motivo" value="acoso" />
                                    Acoso
                                </p>
                                <p>
                                    <input type="checkbox" name="motivo" value="otro" />
                                    Otro
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
                        {profileUser.skills && (
                            <div className="cloud" style={{ border: '3px solid #27ae60' }}>
                                <p>Habilidades</p>
                                <div>
                                    <p>{profileUser.skills ?? 'No se han agregado habilidades'}</p>
                                </div>
                            </div>
                        )}
                        {profileUser.description && (
                            <div className="cloud" style={{ border: '3px solid #27ae60' }}>
                                <p>Descripción</p>
                                <div>
                                    <p>{profileUser.description ?? 'El usuario no ha agregado una descripción'}</p>
                                </div>
                            </div>
                        )}
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
                            {publicaciones?.length > 0 ? (
                                publicaciones.map((post) => (
                                    <Post key={post._id} post={post} />
                                ))
                            ) : (
                                <p>No hay publicaciones disponibles.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
