import axios from 'axios';

const API = 'http://localhost:4000/api';

export const createPostRequest = (post) => axios.post(`${API}/createPost`, post, { withCredentials: true });
export const getPostRequest = (id, username) => 
    axios.get(`${API}/getPost`, { 
      params: { 
        id, 
        username 
      } 
    });  
export const reactionRequest = (reaction) => axios.put(`${API}/reaction`, reaction, { withCredentials: true });
