import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";

const ListaUsuario = ({ usuarios, aoEditar, aoRemover, usuarioLogado }) => {
  // Mapeia o número da permissão para a string correspondente
  const mapPermissaoToString = (permissao) => {
    switch (permissao) {
      case 1:
        return "Funcionário";
      case 2:
        return "Líder";
      case 3:
        return "Diretor";
      default:
        return "Desconhecido";
    }
  };

  // Garante que telefones nunca seja null ou undefined antes de fazer join
  const renderTelefones = (telefones) => {
    if (telefones && telefones.length > 0) {
      return telefones.join(", ");
    }
    return "Nenhum telefone disponível";
  };

  // Filtra os usuários com base no perfil do usuário logado
  const filtrarUsuarios = (usuarios, usuarioLogado) => {
    if (!usuarioLogado || !usuarioLogado.permissao) return [];

    switch (usuarioLogado.permissao) {
      case 1: // Funcionário
        return usuarios.filter((u) => u.permissao === 1);
      case 2: // Líder
        return usuarios.filter((u) => u.permissao <= 2);
      case 3: // Diretor
        return usuarios; // Diretor vê todos os usuários
      default:
        return [];
    }
  };

  const usuariosFiltrados = filtrarUsuarios(usuarios, usuarioLogado);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Lista de Usuários
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Nome</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Documento</strong>
              </TableCell>
              <TableCell>
                <strong>Telefones</strong>
              </TableCell>
              <TableCell>
                <strong>Gerente</strong>
              </TableCell>
              <TableCell>
                <strong>Permissão</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Ações</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosFiltrados.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  {`${usuario.primeiroNome || "Nome não disponível"} ${
                    usuario.ultimoNome || ""
                  }`}
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.documento}</TableCell>
                <TableCell>{renderTelefones(usuario.telefones)}</TableCell>
                <TableCell>{usuario.nomeGerente || "N/A"}</TableCell>
                <TableCell>{mapPermissaoToString(usuario.permissao)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => aoEditar(usuario)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => aoRemover(usuario.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Validação das props
ListaUsuario.propTypes = {
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      primeiroNome: PropTypes.string,
      ultimoNome: PropTypes.string,
      email: PropTypes.string,
      documento: PropTypes.string,
      telefones: PropTypes.arrayOf(PropTypes.string),
      nomeGerente: PropTypes.string,
      permissao: PropTypes.number,
    })
  ).isRequired,
  aoEditar: PropTypes.func.isRequired,
  aoRemover: PropTypes.func.isRequired,
  usuarioLogado: PropTypes.shape({
    permissao: PropTypes.number.isRequired,
  }).isRequired,
};

export default ListaUsuario;
