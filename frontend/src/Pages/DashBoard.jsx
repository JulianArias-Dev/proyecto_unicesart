import { NewPost, Advertising, Post, NewAdd } from '../Componets/components.jsx';
import { useAuth, usePost } from "../context/context.jsx";
import { useEffect, useState } from 'react';
import './DashBoard.css';

const DashBoard = () => {
    const { publicaciones, setPublicaciones, fetchPosts, categorias, noticias, fetchAdds } = usePost();
    const { isAuthenticated, user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchPosts();
        fetchAdds();
    }, [fetchPosts, fetchAdds]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchPosts(null, null, category); // Pasa los parámetros como argumentos individuales
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
                        {noticias.length === 0 ? (
                            <h2>No hay noticias para mostrar</h2>
                        ) : (
                            noticias.map((add) => {                                
                                return <Advertising key={add._id} add={add} />;
                            })
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashBoard;
