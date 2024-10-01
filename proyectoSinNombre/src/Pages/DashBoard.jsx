import Adversiting from "../Componets/Advertising";
import NewPost from "../Componets/NewPost";
import Post from "../Componets/Post";
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
    const { isAuthenticated } = useAuth();

    
    useEffect(() => {
        getPost(); 
    },[]);

    return (
        <>
            {isAuthenticated && <NewPost />}
            <section className="main">
                <div className="dashboard">
                    <div className="mainContent">                        
                        {publicaciones.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}                        
                    </div>
                    <div className="rightContent">
                        <Adversiting imagen={imagenes[0]} />
                        <Adversiting imagen={imagenes[1]} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashBoard;
