 
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { usuarioLogado, logout } = useAuth();

  return (
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
              <Button color="inherit" onClick={logout}>Sair</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 4 }}>
        {children} {/* Renderiza o conteúdo da página */}
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired, // A prop 'children' é obrigatória
};

export default Layout;
