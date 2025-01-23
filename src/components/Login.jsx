import  { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const Login = ({ aoLogar }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:32769/api/usuario/login", {
        email,
        senha,
      });
      if (response.status === 200) {
        const usuario = response.data;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario)); // Salva no localStorage
        aoLogar(usuario); // Passa os dados para o componente pai
      }
    } catch (error) {
      setErro(error.response?.data || "Erro ao fazer login");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        {erro && (
          <Typography color="error" sx={{ marginTop: 1 }}>
            {erro}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Entrar
        </Button>
      </form>
    </Box>
  );
};

Login.propTypes = {
    aoLogar: PropTypes.func.isRequired,

};

export default Login;
