import DbOperacoes from "@database/operacoes";

export class Helper {
  protected dbOperacoes: DbOperacoes;

  constructor () {
    this.dbOperacoes = new DbOperacoes();
  }
}

export default Helper;
