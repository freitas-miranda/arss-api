import Controller from "@controllers/controller";
import { Authentication, Delete, Get, Post, Put, Route } from "@core/routing/controller";
import Perfil from "@models/sistema/perfil";
import { Request, Response } from "express";
import { Op } from "sequelize";
import validate from "validate.js";

@Route("/api/sistema/perfil-acesso")
export class PerfilAcessoController extends Controller {
  private readonly validacaoSalvar: any;
  private readonly validacaoEditar: any;

  constructor () {
    super("PerfilAcesso");

    this.validacaoSalvar = {
      descricao: {
        presence: {allowEmpty: false, message: "^Descrição não informada!"},
        length: {maximum: 100, tooLong: "^Descrição deve ter no máximo %{count} caracteres."}
      }
    };

    this.validacaoEditar = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      },
      ...this.validacaoSalvar
    };
  }

  private async filtroPesquisa (params: any): Promise<string> {
    params = params || { };

    let sql: string = ``;

    if (params.id) sql += ` AND p.id = ${params.id}`;
    else {
      if (params.descricao) sql += ` AND p.descricao LIKE '%${params.descricao}%'`;
    }

    return sql;
  }

  @Authentication()
  @Get("/dropdown")
  async dropdown (_req: Request, res: Response): Promise<any> {
    try {
      const registro = await Perfil.findAll();

      return res.json(registro);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      let sql: string = `
        SELECT p.id
             , p.descricao
          FROM perfil_acesso p
         WHERE p.deleted_at IS NULL`;

      sql += await this.filtroPesquisa(req.query);

      sql += ` GROUP BY p.id  LIMIT 1000`;

      const registros = await this.select(sql);

      return res.json({registros: registros});
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Get("/exibir/:id")
  async exibir (req: Request, res: Response): Promise<any> {
    try {
      const registro = await Perfil.findByPk(req.params.id);

      if (!registro) {
        this.erro.naoEncontradoParaExibir();
      }

      return res.json({ registro });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Post("/salvar")
  async salvar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoSalvar);

      if (erro) {
        return res.status(500).json({ erro });
      }

      const existente = await Perfil.findOne({
        where: {
          descricao: req.body.descricao
        }
      });

      if (existente) {
        throw new Error("Já existe um perfil cadastrado com a descrição informada!");
      }

      const reg = await Perfil.create(req.body);

      return res.json({
        id: reg.id,
        mensagem: this.msg.sucessoAoSalvar()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Put("/editar")
  async editar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoEditar);

      if (erro) {
        return res.status(500).json({ erro });
      }

      const reg = await Perfil.findByPk(req.body.id);

      if (!reg) {
        this.erro.naoEncontradoParaEditar();
      }

      const existente = await Perfil.findOne({
        where: {
          descricao: req.body.descricao,
          id: {
            [Op.ne]: req.body.id
          }
        }
      });

      if (existente) {
        throw new Error("Já existe um perfil cadastrado com a descrição informada!");
      }

      reg.descricao = req.body.descricao;

      await reg.save();

      return res.json({
        id: reg.id,
        mensagem: this.msg.sucessoAoEditar()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Delete("/apagar/:id")
  async apagar (req: Request, res: Response): Promise<any> {
    try {
      const reg = await Perfil.findByPk(req.params.id);

      if (!reg) {
        this.erro.naoEncontradoParaApagar();
      }

      await reg.destroy();

      return res.json({
        id: Number(req.params.id),
        mensagem: this.msg.sucessoAoApagar()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default PerfilAcessoController;
