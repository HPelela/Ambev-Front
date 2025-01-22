import { useEffect, useState } from "react";
import { Container, Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import ListaUsuario from "./components/ListaUsuarios";
import AdicionarUsuario from "./components/AdicionarUsuario";
import EditarUsuario from "./components/EditarUsuario";
import Login from "./components/Login";

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    return usuario ? JSON.parse(usuario) : null;
  });

  const mapPermissaoToString = (permissao) => {
    switch (permissao) {
      case "Funcionario":
        return 1;
      case "Lider":
        return 2;
      case "Diretor":
        return 3;
      default:
        return "Desconhecido";
    }
  };

  const carregarUsuarios = async () => {
    try {
      if (!usuarioLogado) {
        return; // Se não estiver logado, não carrega os usuários
      }

      const response = await axios.get("https://localhost:32769/api/usuario");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const handleLogin = (usuario) => {
    setUsuarioLogado(usuario);
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem("usuarioLogado");
  };

  const handleAdicionar = async (usuario) => {
    try {
      if (!usuarioLogado) return;

      const usuarioAtualId = usuarioLogado.id;
      const usuarioParaSalvar = {
        usuario: {
          id: usuario.id || 0,
          primeiroNome: usuario.primeiroNome,
          ultimoNome: usuario.ultimoNome,
          email: usuario.email,
          documento: usuario.documento,
          telefones: usuario.telefones || [],
          gerenteId: usuario.gerenteId || 0,
          permissao: mapPermissaoToString(usuario.permissao),
          senha: usuario.senha,
          nomeGerente: usuario.nomeGerente || '',
        },
        usuarioAtualId,
      };

      if (usuario.id) {
        await axios.put(`https://localhost:32769/api/usuario/${usuario.id}`, usuarioParaSalvar);
      } else {
        await axios.post("https://localhost:32769/api/usuario", usuarioParaSalvar);
      }

      carregarUsuarios();
      setAdicionando(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const handleEditar = async (usuario) => {
    try {
      if (!usuarioLogado) return;

      const usuarioAtualId = usuarioLogado.id;
      const usuarioParaEditar = {
        usuario: {
          id: usuario.id,
          primeiroNome: usuario.primeiroNome,
          ultimoNome: usuario.ultimoNome,
          email: usuario.email,
          documento: usuario.documento,
          telefones: usuario.telefones || [],
          gerenteId: usuario.gerenteId || 0,
          permissao: usuario.permissao,
          senha: usuario.senha,
          nomeGerente: usuario.nomeGerente || '',
        },
        usuarioAtualId,
      };

      await axios.put(`https://localhost:32769/api/usuario/${usuario.id}`, usuarioParaEditar);
      carregarUsuarios();
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    }
  };

  const handleRemover = async (id) => {
    try {
      if (!usuarioLogado) return;

      const usuarioAtualId = usuarioLogado.id;
      const usuarioParaRemover = { id, usuarioAtualId };

      await axios.delete(`https://localhost:32769/api/usuario/${id}`, {
        data: usuarioParaRemover,
      });
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      carregarUsuarios();
    }
  }, [usuarioLogado]);

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gerenciamento de Usuários
            </Typography>
            {usuarioLogado && (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Bem-vindo, {usuarioLogado.primeiroNome}!
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => setAdicionando(true)}
                  sx={{ mr: 2 }}
                >
                  Adicionar Usuário
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route
              path="/login"
              element={usuarioLogado ? <Navigate to="/usuarios" /> : <Login aoLogar={handleLogin} />}
            />
            <Route
              path="/usuarios"
              element={
                usuarioLogado ? (
                  <>
                    {adicionando && (
                      <AdicionarUsuario
                        aoSalvar={handleAdicionar}
                        aoVoltar={() => setAdicionando(false)}
                      />
                    )}
                    {usuarioSelecionado && (
                      <EditarUsuario
                        usuarioAtual={usuarioSelecionado}
                        aoSalvar={handleEditar}
                        aoVoltar={() => setUsuarioSelecionado(null)}
                      />
                    )}
                    {!adicionando && !usuarioSelecionado && (
                      <ListaUsuario
                        usuarios={usuarios}
                        aoEditar={setUsuarioSelecionado}
                        aoRemover={handleRemover}
                        usuarioLogado={usuarioLogado}
                      />
                    )}
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;
