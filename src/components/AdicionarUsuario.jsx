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

const AdicionarUsuario = ({ aoSalvar, aoVoltar, usuarioLogado }) => {
  const usuarioService = new UsuarioService(); // Instancia o serviço
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [ultimoNome, setUltimoNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefones, setTelefones] = useState("");
  const [gerenteId, setGerenteId] = useState("");
  const [permissao, setPermissao] = useState(1);
  const [senha, setSenha] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [emailErro, setEmailErro] = useState("");

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
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const limparCampos = () => {
    setPrimeiroNome("");
    setUltimoNome("");
    setEmail("");
    setDocumento("");
    setTelefones("");
    setGerenteId("");
    setPermissao("Funcionario");
    setSenha("");
    setEmailErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setEmailErro("E-mail inválido! Por favor, insira um e-mail válido.");
      return;
    }

    const novoUsuario = {
      primeiroNome,
      ultimoNome,
      email,
      documento,
      telefones: telefones.split(",").map((t) => t.trim()),
      gerenteId: gerenteId || 0,
      permissao,
      senha,
    };

    try {
      await usuarioService.salvarUsuario(novoUsuario, usuarioLogado.id); // null para `usuarioAtualId` no contexto de criação
      aoSalvar(novoUsuario);
      limparCampos(); // Limpa os campos após salvar
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
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
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErro("");
              }}
              fullWidth
              required
              error={!!emailErro}
              helperText={emailErro}
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
              label="Senha"
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
              onChange={(e) => setPermissao(Number(e.target.value))} // Garante que será um número
            >
              <MenuItem value={1}>Funcionário</MenuItem> {/* Valor numérico */}
              <MenuItem value={2}>Líder</MenuItem>
              <MenuItem value={3}>Diretor</MenuItem>
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
  usuarioLogado: PropTypes.shape({
      id: PropTypes.number,
  }), // Tornamos usuarioLogado opcional
};

export default AdicionarUsuario;
