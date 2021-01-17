import Controller from "@controllers/controller";
import { Authentication, Delete, Get, Post, Put, Route } from "@core/routing/controller";
import { grupo } from "@models/opcao_item";
import Paciente from "@models/paciente";
import Pessoa from "@models/pessoa";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/paciente/")
export class PacienteController extends Controller {
  private readonly validacaoSalvar: any;
  private readonly validacaoEditar: any;

  constructor () {
    super("Paciente");

    this.validacaoSalvar = {
      nome: {
        presence: {allowEmpty: false, message: "não informado!"},
        length: {maximum: 100, tooLong: "deve ter no máximo %{count} caracteres."}
      },
      cpf: {
        presence: {allowEmpty: false, message: "não informado!"},
        length: {maximum: 11, tooLong: "deve ter no máximo %{count} caracteres."}
      },
      dataNascimento: {
        presence: {allowEmpty: false, message: "não informado!"}
      },
      sexo: {
        presence: {allowEmpty: false, message: "não informado!"}
      }
    };

    this.validacaoEditar = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      },
      ...this.validacaoSalvar,
    };
  }

  @Get("/dropdown")
  async dropdown (_req: Request, res: Response): Promise<Response> {
    try {
      return res.json({
        sexo: await this.opcoes(grupo.sexo),
        tipoSanguineo: await this.opcoes(grupo.tipoSanguineo),
        tipoTelefone: await this.opcoes(grupo.tipoTelefone),
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  private async filtroPesquisa (params: any): Promise<string> {
    params = params || { };
    let sql: string = ``;
    if (params.codigo) sql += ` AND pa.id = ${params.codigo}`;
    if (params.nome) sql += ` AND pe.nome LIKE '%${params.nome}%'`;
    if (params.cpf) sql += ` AND pe.cpf = ${params.cpf}`;
    return sql;
  }

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      let sql: string = `
        SELECT pa.id
             , pe.nome
             , pe.cpf
             , pe.data_nascimento as dataNascimento
             , pe.sexo
             , pa.cartao_sus as cartaoSus
             , pa.tipo_sanguineo as tipoSanguineo
             , pa.peso
             , pa.altura
          FROM paciente AS pa
         INNER JOIN pessoa AS pe
            ON pe.id = pa.pessoa_id
         WHERE pa.deleted_at IS NULL`;

      sql += await this.filtroPesquisa(req.query);

      sql += ` GROUP BY pe.nome  LIMIT 1000`;

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
      const sql: string = `
        SELECT pa.id
             , pe.nome
             , pe.cpf
             , pe.data_nascimento as dataNascimento
             , pe.sexo
             , pa.cartao_sus as cartaoSus
             , pa.tipo_sanguineo as tipoSanguineo
             , pa.peso
             , pa.altura
             , pe.id as pessoaId
          FROM paciente AS pa
         INNER JOIN pessoa AS pe
            ON pe.id = pa.pessoa_id
         WHERE pa.id = :id`;

      const registro = await this.select(sql, {
        plain: true,
        replacements: {
          id: req.params.id
        }
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

      const existente = await Paciente.findOne({
        where: {
          "$pessoa.cpf$": req.body.cpf
        },
        include: [
          { model: Pessoa, as: Pessoa.tableName}
        ]
      });

      if (existente) {
        throw new Error("Já existe um paciente cadastrado com o CPF informado!");
      }

      const nome = req.body.nome;
      const cpf = req.body.cpf;
      const dataNascimento = req.body.dataNascimento;
      const sexo = req.body.sexo;

      delete req.body.nome;
      delete req.body.cpf;
      delete req.body.dataNascimento;
      delete req.body.sexo;

      const pessoaExistente = await Pessoa.findOne({
        where: {
          cpf: cpf
        }
      });

      let pessoaId: number;
      if (pessoaExistente) {
        pessoaId = pessoaExistente.id;
      } else {
        const pessoa = Pessoa.build(Object.assign({
          nome: nome,
          cpf: cpf,
          dataNascimento: dataNascimento,
          sexo: sexo
        }));
        await pessoa.save();
        pessoaId = pessoa.id;
      }

      const reg = await Paciente.create(Object.assign(req.body, {pessoaId: pessoaId}));

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
      if (erro) return res.status(500).json({ erro });

      const paciente = await Paciente.findByPk(req.body.id);
      if (!paciente) this.erro.naoEncontradoParaEditar();
      paciente.cartaoSus = req.body.cartaoSus;
      paciente.tipoSanguineo = req.body.tipoSanguineo;
      paciente.peso = req.body.peso;
      paciente.altura = req.body.altura;

      const pessoa = await Pessoa.findByPk(req.body.pessoaId);
      pessoa.nome = req.body.nome;
      pessoa.cpf = req.body.cpf;
      pessoa.dataNascimento = req.body.dataNascimento;
      pessoa.sexo = req.body.sexo;

      await paciente.save();
      await pessoa.save();

      return res.json({
        id: paciente.id,
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
      const reg = await Paciente.findByPk(req.params.id);

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

export default PacienteController;
