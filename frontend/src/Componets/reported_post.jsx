import './report.css'
import Post from './Post'

const ReportedPost = () => {

    return (
        <div className="reportedUser">
            <div className="reported">
                <p>Publicacion Reportada: </p>
                   {/*  <Post/> */}
            </div>
            <div className="report">
                <p>Motivo</p>
            </div>
            <div>
                <button style={
                    {background: '#1d8348'}
                }>
                    Eliminar
                </button>
                <button   style={{background: '#DE2D18'}}>
                    Verificado
                </button>
            </div>

        </div>
    );
}

export default ReportedPost;