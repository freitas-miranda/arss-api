import HelperMensagens from "@helpers/mensagens";

class HelperErros {
  private msg: HelperMensagens;

  constructor (msg: HelperMensagens) {
    this.msg = msg;
  }

  public criar (msg: string) {
    throw new ErrorValidation (msg);
  }

  public semLogin () {
    throw new ErrorValidation (this.msg.semLogin());
  }

  public camposNaoInformadosParaEditar () {
    throw new ErrorValidation (this.msg.camposNaoInformadosParaEditar());
  }

  public naoEncontradoParaExibir () {
    throw new ErrorValidation (this.msg.naoEncontradoParaExibir());
  }

  public naoEncontradoParaEditar () {
    throw new ErrorValidation (this.msg.naoEncontradoParaEditar());
  }

  public naoEncontradoParaApagar () {
    throw new ErrorValidation (this.msg.naoEncontradoParaApagar());
  }
}
export default HelperErros;

export class ErrorValidation extends Error {
  constructor (message: any) {
    super(message);

    this.message = message;
    this.name = "validation";
  }
}
