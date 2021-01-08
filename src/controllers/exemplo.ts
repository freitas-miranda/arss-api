import Controller from "@controllers/controller";
import { Delete, Get, Post, Put, Route } from "@core/routing/controller";
import HelperMensagens from "@helpers/mensagens";
import Exemplo, { ExemploStatus } from "@models/exemplo";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/exemplo")
export class ExemploController extends Controller {
  private readonly validacaoSalvar: any;
  private readonly validacaoEditar: any;
  private msg: HelperMensagens;

  constructor () {
    super();

    this.msg = new HelperMensagens("Exemplo");

    this.validacaoSalvar = {
      descricao: {
        presence: {allowEmpty: false, message: "^Descrição não informada!"},
        length: {maximum: 100, tooLong: "^Descrição deve ter no máximo %{count} caracteres."}
      },
      status: {
        presence: {allowEmpty: false, message: "^Status não informado!"},
        inclusion: {
          within: [ExemploStatus.Inativo, ExemploStatus.Ativo],
          message: "^Status inválido!"
        }
      }
    };

    this.validacaoEditar = {
      id: {
        presence: {allowEmpty: false, message: "^ID do exemplo não informado!"},
        numericality: {notValid: "^ID do exemplo inválido!"}
      },
      ...this.validacaoSalvar
    };
  }

  private async filtroPesquisa (params: any): Promise<string> {
    params = params || { };

    let sql: string = ``;

    if (params.id) sql += ` AND exemplo.id = ${params.id}`;
    else {
      if (params.descricao) sql += ` AND exemplo.descricao LIKE '%${params.descricao}%'`;
      if (params.status) sql += ` AND exemplo.status = ${params.status}`;
    }

    return sql;
  }

  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      // Query RAW.
      let sql: string = `
        SELECT exemplo.id
             , exemplo.descricao
             , exemplo.status AS statusCodigo
             , opcao.descricao AS status
          FROM exemplo

         INNER
          JOIN opcao
            ON opcao.deleted_at IS NULL
           AND opcao.item = exemplo.status
           AND opcao.grupo = :status /* Status do Exemplo */

         WHERE exemplo.deleted_at IS NULL`;

      sql += await this.filtroPesquisa(req.query);

      const raw = await this.select(sql, {
        replacements: {
          status: 2 // Exemplo do status.
        }
      });

      // Model sequelize-typescript.
      const model = await Exemplo.findAll({ where: req.query });

      return res.json({
        registros: raw,
        model: model
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Get("/exibir/:id")
  async exibir (req: Request, res: Response): Promise<any> {
    try {
      // Query RAW.
      const sql: string = `
        SELECT exemplo.id
             , exemplo.descricao
             , exemplo.status AS statusCodigo
             , opcao.descricao AS status
          FROM exemplo

         INNER
          JOIN opcao
            ON opcao.deleted_at IS NULL
           AND opcao.item = exemplo.status
           AND opcao.grupo = :status /* Status do Exemplo */

         WHERE exemplo.deleted_at IS NULL
           AND exemplo.id = :id`;

      const exemplo = await this.select(sql, {
        plain: true,
        replacements: {
          id: req.params.id,
          status: 2 // Exemplo do status.
        }
      });

      if (!exemplo) {
        throw new Error(this.msg.naoEncontradoParaExibir);
      }

      return res.json(exemplo);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Post("/salvar")
  async salvar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoSalvar);

      if (erro) {
        return res.status(500).json({ erro });
      }

      const exemplo = Exemplo.build(Object.assign(req.body, {
        createdBy: req.body.login
      }));

      await exemplo.save();

      return res.json({
        id: exemplo.id,
        mensagem: this.msg.sucessoAoSalvar
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Put("/editar")
  async editar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoEditar);

      if (erro) {
        return res.status(500).json({ erro });
      }

      const exemplo = await Exemplo.findByPk(req.body.id);

      if (!exemplo) {
        throw new Error(this.msg.naoEncontradoParaEditar);
      }

      exemplo.descricao = req.body.descricao;
      exemplo.status = req.body.status;
      exemplo.updatedBy = req.body.login;

      await exemplo.save();

      return res.json({
        id: exemplo.id,
        mensagem: this.msg.sucessoAoEditar
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/apagar/:id")
  async apagar (req: Request, res: Response): Promise<any> {
    try {
      const exemplo = await Exemplo.findByPk(req.params.id);

      if (!exemplo) {
        throw new Error(this.msg.naoEncontradoParaApagar);
      }

      await exemplo.destroy();

      return res.json({
        id: Number(req.params.id),
        mensagem: "Excluído com sucesso!"
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default ExemploController;
