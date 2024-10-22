import PropTypes from 'prop-types';

const Advertising = ({ imagen }) => {

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

Advertising.propTypes = {
    imagen: PropTypes.string.isRequired,
}

export default Advertising;