import axios from "axios";

class UsuarioService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "https://localhost:32769/api",
    });
  }

  // Carregar todos os usuários
  async carregarUsuarios() {
    try {
      const response = await this.api.get("/usuario");
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      throw error;
    }
  }

  // Adicionar ou editar usuário
  async salvarUsuario(usuario, usuarioAtualId) {
    try {
      const usuarioParaSalvar = {
        usuario: {
          id: usuario.id || 0,
          primeiroNome: usuario.primeiroNome,
          ultimoNome: usuario.ultimoNome,
          email: usuario.email,
          documento: usuario.documento,
          telefones: usuario.telefones || [],
          gerenteId: usuario.gerenteId || 0,
          permissao: usuario.permissao,
          senha: usuario.senha,
          nomeGerente: usuario.nomeGerente || "",
        },
        usuarioAtualId,
      };

      if (usuario.id) {
        await this.api.put(`/usuario/${usuario.id}`, usuarioParaSalvar);
      } else {
        await this.api.post("/usuario", usuarioParaSalvar);
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw error;
    }
  }

  // Remover usuário
  async removerUsuario(id, usuarioAtualId) {
    try {
      const usuarioParaRemover = { id, usuarioAtualId };
      await this.api.delete(`/usuario/${id}`, {
        data: usuarioParaRemover,
      });
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      throw error;
    }
  }
}

export default UsuarioService;
