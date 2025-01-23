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

import PropTypes from "prop-types";
import UsuarioService from "../services/usuarioService";

const EditarUsuario = ({ usuarioAtual, aoSalvar, aoVoltar }) => {
  const usuarioService = new UsuarioService();
  const [primeiroNome, setPrimeiroNome] = useState(usuarioAtual.primeiroNome || "");
  const [ultimoNome, setUltimoNome] = useState(usuarioAtual.ultimoNome || "");
  const [email, setEmail] = useState(usuarioAtual.email || "");
  const [documento, setDocumento] = useState(usuarioAtual.documento || "");
  const [telefones, setTelefones] = useState(usuarioAtual.telefones?.join(", ") || "");
  const [gerenteId, setGerenteId] = useState(usuarioAtual.gerenteId ? String(usuarioAtual.gerenteId) : "");
  const [permissao, setPermissao] = useState(usuarioAtual.permissao || 1); // Alterado para número (1 a 3)
  const [senha, setSenha] = useState(usuarioAtual.senha || "");  // Campo de senha
  const [usuarios, setUsuarios] = useState([]);
  const [emailErro, setEmailErro] = useState(""); // Estado para erro de email


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuarios = await usuarioService.carregarUsuarios();
        setUsuarios(usuarios);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsuarios();
  }, []);


  const validarEmail = (email) => {
    // Expressão regular para validar o formato do email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setEmailErro("E-mail inválido! Por favor, insira um e-mail válido.");
      return;
    }

    const usuarioEditado = {
      id: usuarioAtual.id,
      primeiroNome,
      ultimoNome,
      email,
      documento,
      telefones: telefones.split(",").map((t) => t.trim()),
      gerenteId: gerenteId || null,
      permissao,  // A permissão agora é um número
      senha: senha || undefined,  // Enviar a senha apenas se for preenchida
    };
    aoSalvar(usuarioEditado);
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
        Editar Usuário
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
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErro(""); // Limpa o erro quando o usuário começa a digitar
              }}
              fullWidth
              required
              error={!!emailErro} // Mostra erro caso exista
              helperText={emailErro} // Exibe a mensagem de erro
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
                <MenuItem value={1}>Funcionário</MenuItem> {/* Agora um número */}
                <MenuItem value={2}>Líder</MenuItem>      {/* Agora um número */}
                <MenuItem value={3}>Diretor</MenuItem>     {/* Agora um número */}
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
              Salvar Alterações
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

EditarUsuario.propTypes = {
  usuarioAtual: PropTypes.shape({
    id: PropTypes.number.isRequired,
    primeiroNome: PropTypes.string,
    ultimoNome: PropTypes.string,
    email: PropTypes.string,
    documento: PropTypes.string,
    telefones: PropTypes.arrayOf(PropTypes.string),
    gerenteId: PropTypes.number,
    senha: PropTypes.string,
    permissao: PropTypes.number,  // Alterado para número
  }).isRequired,
  aoSalvar: PropTypes.func.isRequired,
  aoVoltar: PropTypes.func.isRequired,
};

export default EditarUsuario;
