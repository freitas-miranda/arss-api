class HelperMensagens {
  private modelName: string;

  constructor (modelName: string) {
    this.modelName = modelName;
  }
  public semLogin = "Login não informado.";

  public naoEncontradoParaExibir = "Registro não encontrado para exibir: " + this.modelName + "!";
  public naoEncontradoParaEditar = "Registro não encontrado para editar: " + this.modelName + "!";
  public naoEncontradoParaApagar = "Registro não encontrado para excluir: " + this.modelName + "!";

  public sucessoAoSalvar = "Registrado com sucesso!";
  public sucessoAoEditar = "Alterado com sucesso!";
  public sucessoAoApagar = "Excluído com sucesso!";
}
export default HelperMensagens;
