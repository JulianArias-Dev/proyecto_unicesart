import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Post, ReportForm } from '../components/components.jsx';
import './Profile.css';
import { useAuth, usePost, useReport } from '../context/context.jsx';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogReportRef = useRef(null);
    const { user: loggedInUser, getUserProfile, suspendUser } = useAuth();
    const { fetchPosts, publicaciones, setPublicaciones } = usePost();
    const { saveUserReport } = useReport();
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setProfileUser(null);

            try {
                const userProfile = await getUserProfile(username);
                if (userProfile) {
                    setProfileUser(userProfile);
                    if (userProfile.role === "usuario") {
                        const data = {
                            id: userProfile.id,
                            username: userProfile.username,
                        }
                        await fetchPosts(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username, getUserProfile, fetchPosts]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmitReport = (formData) => {
        const data = {
            usuarioReporte: {
                id: loggedInUser.id,
                username: loggedInUser.username,
            },
            descripcion: formData.descripcion,
            motivo: formData.motivo.join(", "),
            usuarioReportado: {
                id: profileUser.id,
                username: profileUser.username,
            }
        };
        saveUserReport(data);
        dialogReportRef.current.close();
    };

    const showDialog = () => {
        toggleMenu();
        if (dialogReportRef.current) {
            dialogReportRef.current.open
                ? dialogReportRef.current.close()
                : dialogReportRef.current.showModal();
        }
    };

    if (loading) {
        return <div style={{ height: '120px' }}>Cargando perfil...</div>;
    }

    if (!profileUser) {
        return <div>No se encontró el perfil del usuario.</div>;
    }

    const handleDeletePost = (postId) => {
        setPublicaciones((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    };

    const handleUpdateStatus = async () => {
        toggleMenu();
        const data = await suspendUser(profileUser.id);

        if (data) {
            setProfileUser({
                ...profileUser,
                status: data.status // Actualizamos el campo `status`
            });
        }
    };

    const renderUserOptions = () => {
        if (loggedInUser?.role !== "administrador") {
            return (
                <li>
                    <button className="report-item" onClick={showDialog}>
                        <i className="fa-solid fa-flag"></i> Reportar Usuario
                    </button>
                </li>
            );
        }

        if (profileUser.status === "Activo") {
            return (
                <li>
                    <button className="report-item" onClick={handleUpdateStatus}>
                        <i className="fa-solid fa-ban"></i> Suspender Usuario
                    </button>
                </li>
            );
        }

        return (
            <li>
                <button className="report-item" onClick={handleUpdateStatus}>
                    <i className="fa-regular fa-square-check"></i> Activar Usuario
                </button>
            </li>
        );
    };

    {/* En tu JSX original, reemplaza el bloque con esta función */ }
    {
        isOpen && (
            <ul className="report-menu2">
                {renderUserOptions()}
                <li>
                    <button className="report-item" onClick={toggleMenu}>
                        <i className="fa-solid fa-x"></i> Cerrar
                    </button>
                </li>
            </ul>
        )
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
                        <section style={{ marginLeft: '85%' }} className="report-dropdown">
                            <button className="report-button" onClick={toggleMenu}>
                                <i style={{ color: 'white', fontSize: '25px' }} className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </section>
                    )}
                    {isOpen && (
                        <ul className="report-menu2">
                            {renderUserOptions()}
                            <li>
                                <button className="report-item" onClick={toggleMenu}>
                                    <i className="fa-solid fa-x"></i> Cerrar
                                </button>
                            </li>
                        </ul>
                    )}
                    
                    <dialog ref={dialogReportRef} className="dialogPost dialogReport">
                        <h3>Reportar Usuario</h3>
                        {/* Aquí integramos el ReportForm */}
                        <ReportForm
                            onSubmit={handleSubmitReport}
                            onCancel={() => dialogReportRef.current.close()}
                            opcion='usuario'
                        />
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
                            {profileUser.status === "Suspendido" ?
                                (<p>El usuario ha sido suspendido debido a una infracción de las normas de la página.</p>) :
                                publicaciones?.length > 0 && profileUser.role === "usuario" ? (
                                    publicaciones.map((post) => (
                                        <Post key={post._id} post={post} onDelete={handleDeletePost} />
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
