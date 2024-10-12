import PropTypes from 'prop-types';

const Adversiting = ({ imagen }) => {

    return (
        <div className="add">
            <img src={imagen} alt="noticia" />
            <span>
                <span>
                    Más información
                </span>
            </span>
        </div>
    );
}

Adversiting.propTypes = {
    imagen: PropTypes.string.isRequired,
}

export default Adversiting;