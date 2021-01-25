import Controller from "@base/controller";
import { Authentication, Delete, Get, Post, Put, Route } from "@core/routing/controller";
import Usuario from "@models/usuario";
import { Request, Response } from "express";
import { Op } from "sequelize";
import validate from "validate.js";

@Route("/api/controle-acesso/usuario")
export class UsuarioController extends Controller {
  private readonly validacaoSalvar: any;
  private readonly validacaoEditar: any;
  private readonly validacaoRedefinirSenha: any;

  constructor () {
    super("Usuario");

    this.validacaoSalvar = {
      nome: {
        presence: {allowEmpty: false, message: "não informado!"},
        length: {maximum: 50, tooLong: "deve ter no máximo %{count} caracteres."}
      },
      email: {
        presence: {allowEmpty: false, message: "não informado!"},
        length: {maximum: 100, tooLong: "deve ter no máximo %{count} caracteres."}
      },
      senha: {
        presence: {allowEmpty: false, message: "não informada!"},
        length: {maximum: 100, tooLong: "deve ter no máximo %{count} caracteres."}
      },
      ativo: {
        presence: {allowEmpty: false, message: "não informado!"}
      }
    };

    this.validacaoEditar = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      },
      ...this.validacaoSalvar,
      senha: undefined
    };

    this.validacaoRedefinirSenha = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      },
      senha: {
        presence: {allowEmpty: false, message: "não informada!"},
        length: {maximum: 100, tooLong: "deve ter no máximo %{count} caracteres."}
      }
    };
  }

  private async filtroPesquisa (params: any): Promise<string> {
    params = params || { };

    let sql: string = ``;

    if (params.codigo) sql += ` AND u.id = ${params.codigo}`;
    if (params.nome) sql += ` AND u.nome LIKE '%${params.nome}%'`;
    if (params.email) sql += ` AND u.email LIKE '%${params.email}%'`;
    if (params.perfil) sql += ` AND pa.descricao LIKE '%${params.perfil}%'`;
    if (params.ativo) sql += ` AND u.ativo = ${params.ativo}`;

    return sql;
  }

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      let sql: string = `
        SELECT u.id
             , u.nome
             , u.email
             , pa.descricao as perfil
             , IF(u.ativo = 1, 'SIM', 'NÃO') AS ativo
          FROM usuario AS u
         INNER JOIN perfil_acesso AS pa
            ON pa.id = u.perfil_acesso_id
         WHERE u.deleted_at IS NULL`;

      sql += await this.filtroPesquisa(req.query);

      sql += ` GROUP BY u.id  LIMIT 1000`;

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
      const registro = await Usuario.findByPk(req.params.id, {
        attributes: ["id", "nome", "email", "ativo", "perfilAcessoId"]
      });

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

      const existente = await Usuario.findOne({
        where: {
          email: req.body.email
        }
      });

      if (existente) {
        throw new Error("Já existe um usuário cadastrado com o email informado!");
      }

      const novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        ativo: req.body.ativo,
        perfilAcessoId: req.body.perfilAcessoId || 4 // 4-Paciente
      }

      const reg = await Usuario.create(novoUsuario);

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

      const reg = await Usuario.findByPk(req.body.id);

      if (!reg) {
        this.erro.naoEncontradoParaEditar();
      }

      const existente = await Usuario.findOne({
        where: {
          email: req.body.email,
          id: {
            [Op.ne]: req.body.id
          }
        }
      });

      if (existente) {
        throw new Error("Já existe um usuário cadastrado com o email informado!");
      }

      reg.nome = req.body.nome;
      reg.email = req.body.email;
      reg.ativo = req.body.ativo;
      reg.perfilAcessoId = req.body.perfilAcessoId;

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
      const reg = await Usuario.findByPk(req.params.id);

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

  @Authentication()
  @Put("/redefinir-senha")
  async redefinirSenha (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoRedefinirSenha);

      if (erro) {
        return res.status(500).json({ erro });
      }

      const reg = await Usuario.findByPk(req.body.id);

      if (!reg) {
        this.erro.naoEncontradoParaEditar();
      }

      reg.senha = req.body.senha;

      await reg.save();

      return res.json({
        id: Number(req.body.id),
        mensagem: this.msg.sucessoAoEditar()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default UsuarioController;
