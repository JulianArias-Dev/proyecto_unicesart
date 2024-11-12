import { NewPost, Advertising, Post, NewAdd } from '../Componets/components.jsx';
import { useAuth } from "../context/AuthContext.jsx";
import { usePost } from "../context/PostContext.jsx";
import { useEffect, useState } from 'react';
import './DashBoard.css';

const DashBoard = () => {
    const imagenes = [
        'src/assets/not1.png',
        'src/assets/not2.png'
    ];

    const { publicaciones, setPublicaciones, getPost, categorias } = usePost();
    const { isAuthenticated, user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        getPost();
    }, [getPost]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        getPost(null, null, category); // Pasa los parámetros como argumentos individuales
    };

    const handleDeletePost = (postId) => {
        setPublicaciones((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    };

    return (
        <>
            {(isAuthenticated && user.role !== 'administrador') && (<NewPost />)}
            {(isAuthenticated && user.role === 'administrador') && (<NewAdd />)}
            <section className="main">
                <div className="dashboard">
                    <div className="leftContent">
                        <div>
                            <p>Filtrar por Categoría:</p>
                            <div className="categoriaBotones">
                                {/* Botón para seleccionar "Todas" las categorías */}
                                <button
                                    className={`categoriaBoton ${selectedCategory === '' ? 'seleccionado' : ''}`}
                                    onClick={() => handleCategoryChange('')}
                                >
                                    Todas
                                </button>

                                {/* Botones de las demás categorías */}
                                {categorias?.map((categoria) => (
                                    <button
                                        key={categoria.nombre}
                                        className={`categoriaBoton ${selectedCategory === categoria.nombre ? 'seleccionado' : ''}`}
                                        onClick={() => handleCategoryChange(categoria.nombre)}
                                    >
                                        {categoria.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mainContent">

                            {publicaciones.length === 0 ? (
                                <h2>No hay publicaciones para mostrar</h2>
                            ) : (
                                publicaciones.map((post) => {
                                    if (typeof post.user === 'string') {
                                        post.user = { username: post.user, id: post._id };
                                    }
                                    return <Post key={post._id} post={post} onDelete={handleDeletePost} />;
                                })
                            )}
                        </div>
                    </div>


                    <div className="rightContent">
                        <Advertising imagen={imagenes[0]} />
                        <Advertising imagen={imagenes[1]} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashBoard;
