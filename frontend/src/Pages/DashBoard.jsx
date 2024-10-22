import {NewPost, Advertising, Post, NewAdd} from '../Componets/components.jsx';
import { useAuth } from "../context/AuthContext.jsx";
import { usePost } from "../context/PostContext.jsx";
import { useEffect } from 'react';
import './DashBoard.css';

const DashBoard = () => {
    const imagenes = [
        'src/assets/not1.png',
        'src/assets/not2.png'
    ];

    const { publicaciones, getPost } = usePost();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        getPost();
    }, [getPost]);

    return (
        <>
            {(isAuthenticated && user.role !== 'administrador') ? (<NewPost />) : (<NewAdd />)}
            <section className="main">
                <div className="dashboard">
                    <div className="mainContent">
                        {publicaciones.length === 0 ? (
                            <h2>No hay publicaciones para mostrar</h2>
                        ) : (
                            publicaciones.map((post) => {
                                if (typeof post.user === 'string') {
                                    post.user = { username: post.user, id: post._id };
                                }
                                return <Post key={post._id} post={post} />;
                            })
                        )}
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
