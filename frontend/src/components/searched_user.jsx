import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SearchedUser = ({ result }) => {

    return (
        <div className="searcheduser">
            <div>
                <i className="fa-solid fa-user"></i>
            </div>
            <div>
                <p className='userLink'><Link to={`/profile/${result._id}`}>{result.username}</Link></p>
                <p>Nombre: {result.fullName}</p>
                <p>
                    {result.edad && `${result.edad} años`}
                    {result.lugarOrigen?.nombreMunicipio && result.lugarOrigen?.nombreDepartamento &&
                        ` - ${result.lugarOrigen.nombreMunicipio}, ${result.lugarOrigen.nombreDepartamento}`}
                </p>
            </div>
        </div>
    )
}

SearchedUser.propTypes = {
    result: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        lugarOrigen: PropTypes.shape({
            nombreDepartamento: PropTypes.string.isRequired,
            nombreMunicipio: PropTypes.string.isRequired,
        }).isRequired,
        username: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        edad: PropTypes.number.isRequired,
    }).isRequired
}

export default SearchedUser;