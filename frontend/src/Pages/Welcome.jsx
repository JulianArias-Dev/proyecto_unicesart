import './Home.css'
import Aos from 'aos';
import 'aos/dist/aos.css'
import { useEffect } from 'react';

const Welcome = () => {
    useEffect(()=>{
        Aos.init();
    })

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
                                <img data-aos="flip-left" data-aos-duration="3000" src="src/assets/imagen1.jpeg" alt="img" />
                                <img data-aos="flip-right" data-aos-duration="3000" src="src/assets/imagen2.jpg" alt="img" />
                                <img data-aos="flip-left" data-aos-duration="3000" src="src/assets/imagen3.jpeg" alt="img" />
                                <img data-aos="flip-right" data-aos-duration="3000" src="src/assets/imagen4.jpeg" alt="img" />
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