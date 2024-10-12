import '../Pages/Home.css'

const Footer = () => {

    return (
        <footer>
            <h2>Universidad Popular del Cesar</h2>
            <div className="containFooter">
                <div className="pqrs">
                    <p>Derechos Académicos</p>
                    <p>Mapa del sitio</p>
                    <p>Preguntas Frecuentes</p>
                </div>
                <div className="contact">
                    <p>Seded Administrativa: Balneario Hurtado, via a Patillal</p>
                    <p>Valledupar - Cesar, Colombia</p>
                    <p>Mecanismos de Contacto</p>
                    <p>E-mail: pqrs@unicesar.edu.co</p>
                </div>
                <div className="more">
                    <p>© Copyright 2024</p>
                    <p>Universidad Popular del Cesar</p>
                    <p>Acerca de este sitio web</p>
                </div>
            </div>
            <p>Institución de Educación Superior sujeta a inspección y vigilancia por el Ministerio de Educación Nacional – Código SNIES 1120</p>
        </footer>
    );
}

export default Footer;