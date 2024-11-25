import { useParams } from "react-router-dom";
import { SearchedUser } from "../Componets/components";
import { useAuth } from '../context/context'
import './results.css'
import { useEffect, useState } from "react";

const UserResult = () => {
    const { query } = useParams();
    const { getUsers } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (query) {
                try {
                    const res = await getUsers(query);
                    console.log(res.data);
                    setUsers(res.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            }
        };
    
        fetchUsers(); // Llamada a la función asíncrona
    }, [query]);
    

    return (
        <div className="results">
            <h1>Resultados para : {query}</h1>

            {(users?.length > 0) ? (
                users.map((user) => (
                    <SearchedUser
                        key={user._id}
                        result={user}
                    />
                ))
            ) : (
                <p className='comment'>No hay comentarios disponibles.</p>
            )}
        </div>
    );
}

export default UserResult;