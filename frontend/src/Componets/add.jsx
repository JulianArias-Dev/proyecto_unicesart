import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth } from '../context/context';

const Advertising = ({ add }) => {

    const [buttons, setButtons] = useState(false);
    const { user } = useAuth();

    const enableButtons = () => {
        if (user.role === "administrador") {
            setButtons(!buttons);
        }
    }

    return (
        <div className="add" onMouseEnter={enableButtons} onMouseLeave={enableButtons}>
            <img src={add.imageUrl} alt="noticia" />
            <span>
                <a href={add.link}>
                    Más información
                </a>
            </span>
            {buttons &&
                <div className="buttonsAdd">
                    <button style={{ background: '#DE2D18' }}><i className="fa-solid fa-trash"></i></button>
                    <button style={{ background: '#1d8348' }}><i className="fa-solid fa-pen"></i></button>
                </div>}
        </div>
    );
}

Advertising.propTypes = {
    add: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
    }).isRequired
}

export default Advertising;