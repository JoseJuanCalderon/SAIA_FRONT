import axios from 'axios';

const API_URL = 'https://saia-api.onrender.com'; // Cambia a la URL de tu API

export const login = async (correo, contrasena) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { correo, contrasena });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: 'Error de conexión' };
    }
};
