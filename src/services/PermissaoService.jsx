class PermissaoService {
    // Converte a permissão de string para número
    static mapPermissaoToString(permissao) {
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
    }
  }
  
  export default PermissaoService;
  