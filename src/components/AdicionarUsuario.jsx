import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const AdicionarUsuario = ({ aoSalvar, aoVoltar }) => {
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefones, setTelefones] = useState("");
  const [gerenteId, setGerenteId] = useState("");
  const [permissao, setPermissao] = useState("Funcionario");
  const [senha, setSenha] = useState("");  // Campo de senha
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:32769/api/usuario")
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Erro ao carregar usuários:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoUsuario = {
      primeiroNome,
      ultimoNome,
      email,
      documento,
      telefones: telefones.split(",").map((t) => t.trim()),
      gerenteId: gerenteId || null,
      permissao,
      senha, 
    };
    aoSalvar(novoUsuario);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Adicionar Usuário
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primeiro Nome"
              value={primeiroNome}
              onChange={(e) => setPrimeiroNome(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Último Nome"
              value={ultimoNome}
              onChange={(e) => setUltimoNome(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Telefones (separados por vírgula)"
              value={telefones}
              onChange={(e) => setTelefones(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Senha"  // Campo de senha
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="permissao-label">Permissão</InputLabel>
              <Select
                labelId="permissao-label"
                value={permissao}
                onChange={(e) => setPermissao(e.target.value)}
              >
                <MenuItem value="Funcionario">Funcionário</MenuItem>
                <MenuItem value="Lider">Líder</MenuItem>
                <MenuItem value="Diretor">Diretor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gerente-label">Gerente</InputLabel>
              <Select
                labelId="gerente-label"
                value={gerenteId}
                onChange={(e) => setGerenteId(e.target.value)}
              >
                <MenuItem value="">Nenhum</MenuItem>
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {`${usuario.primeiroNome} ${usuario.ultimoNome}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              onClick={aoVoltar}
              variant="outlined"
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Voltar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

AdicionarUsuario.propTypes = {
  aoSalvar: PropTypes.func.isRequired,
  aoVoltar: PropTypes.func.isRequired,
};

export default AdicionarUsuario;
