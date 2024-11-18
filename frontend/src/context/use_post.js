
import { PostContext } from "./PostContext";
import { useContext } from "react";

const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
};

export default usePost;