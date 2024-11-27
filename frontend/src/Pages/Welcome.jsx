import './Home.css'
import Aos from 'aos';
import 'aos/dist/aos.css'
import { useEffect } from 'react';
import { usePost } from '../context/context'
import { Post } from '../components/components'

const Welcome = () => {
    const { fetchPosts, publicaciones } = usePost();

    useEffect(() => {
        fetchPosts();
        Aos.init();
    }, [fetchPosts])

    return (
        <div className='Father'>
            <section className="samples">
                <img className="back" src="src\assets\street-art-7888561_1920.jpg" alt="" />
                <div className="onSamples">
                    <div className="container">
                        <div className="contenido">
                            <h2 data-aos="fade-down" data-aos-duration="2000">Bienvenido a UnicesArt</h2>
                            <span data-aos="fade-up" data-aos-duration="2000">Un espacio creado para compartir el arte estudiantil en imágenes y videos.</span>
                            <hr />
                            <div className="imagenes">
                                {
                                    publicaciones.length === 0 ? (
                                        <h2>No hay publicaciones para mostrar</h2>
                                    ) : (
                                        (() => {
                                            // Seleccionar dos elementos aleatorios
                                            const shuffled = [...publicaciones].sort(() => 0.5 - Math.random());
                                            const randomPosts = shuffled.slice(0, 2);

                                            return randomPosts.map((post) => {
                                                if (typeof post.user === "string") {
                                                    post.user = { username: post.user, id: post._id };
                                                }
                                                return <Post key={post._id} post={post} />;
                                            });
                                        })()
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div className="contribucion">
                        <p>Imagen de <a href="https://pixabay.com/es/users/tho-ge-113537/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7888561">Thomas G.</a> en <a href="https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7888561">Pixabay</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Welcome;