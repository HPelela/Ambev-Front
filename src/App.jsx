import { useState, useEffect } from "react";
import { Container, Box, Typography, Button, AppBar, Toolbar, Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import UsuarioService from "./services/usuarioService";
import PermissaoService from "./services/PermissaoService";

import ListaUsuario from "./components/ListaUsuarios";
import AdicionarUsuario from "./components/AdicionarUsuario";
import EditarUsuario from "./components/EditarUsuario";
import Login from "./components/Login";

const App = () => {
  const { usuarioLogado, login, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const usuarioService = new UsuarioService();

  const carregarUsuarios = async () => {
    try {
      if (!usuarioLogado) return;
      const usuarios = await usuarioService.carregarUsuarios();
      setUsuarios(usuarios);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (usuarioLogado) {
      carregarUsuarios();
    }
  }, [usuarioLogado]);

  const handleAdicionar = async (usuario) => {
    try {
      if (!usuarioLogado) return;
      const permissao = PermissaoService.mapPermissaoToString(usuario.permissao);
      usuario.permissao = permissao;
      await usuarioService.salvarUsuario(usuario, usuarioLogado.id);
      carregarUsuarios();
      setAdicionando(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditar = async (usuario) => {
    try {
      if (!usuarioLogado) return;
      await usuarioService.salvarUsuario(usuario, usuarioLogado.id);
      carregarUsuarios();
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemover = async (id) => {
    try {
      if (!usuarioLogado) return;
      await usuarioService.removerUsuario(id, usuarioLogado.id);
      carregarUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gerenciamento de Usuários
          </Typography>
          {usuarioLogado && (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="inherit">
                  <AccountCircle />
                </IconButton>
                <Typography variant="body1" sx={{ mr: 2, fontWeight: "bold" }}>
                  {usuarioLogado.primeiroNome}
                </Typography>
              </Box>
              <Button color="inherit" onClick={handleMenuOpen}>
                Menu
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { setAdicionando(true); handleMenuClose(); }}>Adicionar Usuário</MenuItem>
                <MenuItem onClick={() => { logout(); handleMenuClose(); }}>Sair</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={usuarioLogado ? <Navigate to="/usuarios" /> : <Login aoLogar={login} />} />
          <Route
            path="/usuarios"
            element={
              usuarioLogado ? (
                <>
                  {adicionando && <AdicionarUsuario aoSalvar={handleAdicionar} aoVoltar={() => setAdicionando(false)} usuarioLogado={usuarioLogado}/>}
                  {usuarioSelecionado && <EditarUsuario usuarioAtual={usuarioSelecionado} aoSalvar={handleEditar} aoVoltar={() => setUsuarioSelecionado(null)} />}
                  {!adicionando && !usuarioSelecionado && <ListaUsuario usuarios={usuarios} aoEditar={setUsuarioSelecionado} aoRemover={handleRemover} usuarioLogado={usuarioLogado} />}
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
  );
};

export default App;
