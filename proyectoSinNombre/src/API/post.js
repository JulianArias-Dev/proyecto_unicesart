import axios from 'axios';

const API = 'http://localhost:4000/api';

export const createPostRequest = (post) => axios.post(`${API}/createPost`, post, { withCredentials: true });
export const getPostRequest = (id, userName) => 
    axios.get(`${API}/getPost`, { 
      params: { 
        id, 
        userName 
      } 
    });  
export const reactionRequest = (reaction) => axios.put(`${API}/reaction`, reaction, { withCredentials: true });
