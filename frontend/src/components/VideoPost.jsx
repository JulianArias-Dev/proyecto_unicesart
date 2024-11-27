import { Link } from "react-router-dom";
import { useState } from "react";

const VideoPost = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleReport = (option) => {
        console.log(`Reportado por: ${option}`);
        setIsOpen(false);
    };

    return (
        <div className="post">
            <div className="post-top">
                <div className="userInfo">
                    <i className="fa-solid fa-user"></i>
                    <p><Link to={"/profile"}>Usuario</Link></p>
                </div>
                <div className="report-dropdown" >
                    <button className="report-button" onClick={toggleMenu}>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
                {isOpen && (
                    <ul className="report-menu">
                        <li className="report-item" onClick={() => handleReport('Contenido inapropiado')}>
                            <i className="fa-solid fa-flag"></i>Contenido inapropiado
                        </li>
                        <li className="report-item" onClick={() => handleReport('Spam')}>
                            <i className="fa-solid fa-trash"></i>Eliminar Publicacion
                        </li>
                        <li className="report-item" onClick={() => handleReport('Acoso')}>
                            <i className="fa-solid fa-pen"></i>Editar Publicación
                        </li>
                        <li className="report-item" onClick={() => handleReport('Otro')}>Otro</li>
                    </ul>
                )}
            </div>
            <div className="publicacionVideo">
                <video controls>
                    <source src="" type="video/mp4" />
                </video>
                <div className="contenido">
                    <div className="descripcion">
                        <div className="reseña">
                            <p>Titulo:</p>
                            <p>Descripcion: <br />
                                <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe hic nihil facilis quibusdam debitis impedit doloribus aspernatur amet eos. Expedita?</span>
                            </p>
                            <div style={{ marginTop: '20px' }}>
                                <p>Tipo:</p>
                                <p style={{ marginTop: '10px' }}>Tecnica Utilizada: </p>
                            </div>
                        </div>
                    </div>
                    <div className="reaccion">
                        <p>
                            <span>x</span>
                            <i className="fa-regular fa-heart"></i>
                            <span>Me encanca</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPost;