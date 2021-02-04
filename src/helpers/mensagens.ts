class HelperMensagens {
  private modelName: string;

  constructor (modelName: string) {
    this.modelName = modelName;
  }

  public semLogin (): string {
    return "Login não informado.";
  }

  public camposNaoInformadosParaEditar (): string {
    return "Campos não informados para editar: " + this.modelName + "!";
  }

  public naoEncontradoParaExibir (): string {
    return "Registro não encontrado para exibir: " + this.modelName + "!";
  }

  public naoEncontradoParaEditar (): string {
    return "Registro não encontrado para editar: " + this.modelName + "!";
  }

  public naoEncontradoParaApagar (): string {
    return "Registro não encontrado para excluir: " + this.modelName + "!";
  }

  public sucessoAoSalvar (): string {
    return "Adicionado com sucesso!";
  }

  public sucessoAoEditar (): string {
    return "Alterado com sucesso!";
  }

  public sucessoAoApagar (): string {
    return "Excluído com sucesso!";
  }

  public sucessoAoExecutar (): string {
    return "Executado com sucesso!";
  }
}
export default HelperMensagens;
