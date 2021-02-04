import { Auth } from "@core/access_control";
import BaseController from "@core/routing/controller";
import DbOperacoes from "@database/operacoes";
import HelperAutorizacao from "@helpers/autorizacao";
import HelperEmail from "@helpers/email";
import HelperErros from "@helpers/erros";
import HelperMensagens from "@helpers/mensagens";
import Opcoes from "@models/opcao_item";
import Usuario from "@models/usuario";
import { Op, QueryTypes } from "sequelize";

export class Controller extends BaseController {
  protected readonly autorizacao: HelperAutorizacao;
  protected readonly email: HelperEmail;
  private name: string;
  protected erro: HelperErros;
  protected msg: HelperMensagens;
  protected dbOperacoes: DbOperacoes;

  constructor (nomeController: string) {
    super();

    this.name = nomeController;
    this.msg = new HelperMensagens(this.name);
    this.erro = new HelperErros(this.msg);
    this.autorizacao = new HelperAutorizacao();
    this.email = new HelperEmail();
    this.dbOperacoes = new DbOperacoes();
  }

  protected async allowed (auth?: any, rule?: number): Promise<boolean> {
    return this.autorizacao.usuarioAutorizado(auth, rule);
  }

  protected async auth (email: string, senha: string, registrar: boolean = false): Promise<Usuario> {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw { email: ["E-mail não cadastrado!"] };
    }

    if (senha !== usuario.senha) {
      throw { senha: ["Senha incorreta!"] };
    }

    if (!usuario.ativo) {
      throw new Error("Cadastro não está habilitado!");
    }

    if (registrar) {
      await Auth.login(usuario);
    }

    return usuario;
  }

  protected async changePassword (email: string, senha: string, senhaNova: string): Promise<void> {
    const usuario = await this.auth(email, senha, true);
    usuario.senha = senhaNova;
    await usuario.save();
  }

   protected async filter (data: string) {
    if (!data) return { };
    else {
      const filters: any = JSON.parse(data);
      const entries: any = Object.entries(filters);
      const objects: any = { };

      for (const [element, value] of entries) {
        objects[element] = {
          [Op.substring]: value.replace(" ", "%")
        };
      }

      return objects;
    }
  }

  protected async select (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.db().query(sql, {
      type: QueryTypes.SELECT,
      ...opcoes
    });
    return query;
  }

  protected async selectRow (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.db().query(sql, {
      type: QueryTypes.SELECT,
      plain: true,
      ...opcoes
    });
    return query;
  }

  protected async opcoes (opcaoId: number): Promise<any> {
    return  Opcoes.findAll({
      attributes: ["codigo", "descricao"],
      where: { opcaoId: opcaoId },
      order: [["ordem", "asc" ]]
    });
  }

}

export default Controller;
