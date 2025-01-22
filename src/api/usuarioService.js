import api from './axiosConfig';

const UsuarioService = {
    obterTodos: async () => {
        const response = await api.get('/usuarios');
        return response.data;
    },
    obterPorId: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },
    adicionar: async (usuario) => {
        const response = await api.post('/usuarios', usuario);
        return response.data;
    },
    atualizar: async (id, usuario) => {
        const response = await api.put(`/usuarios/${id}`, usuario);
        return response.data;
    },
    remover: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },
};

export default UsuarioService;
