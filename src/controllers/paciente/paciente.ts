import Controller from "@base/controller";
import { Authentication, Delete, Get, Post, Put, Route } from "@core/routing/controller";
import HelperPessoa from "@helpers/pessoa";
import { grupo } from "@models/opcao_item";
import Paciente from "@models/paciente";
import Pessoa from "@models/pessoa";
import PessoaTelefone from "@models/pessoa_telefone";
import Telefone from "@models/telefone";
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

  @Authentication()
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
    if (params.codigo) sql += ` AND paciente.id = ${params.codigo}`;
    if (params.nome) sql += ` AND pessoa.nome LIKE '%${params.nome}%'`;
    if (params.cpf) sql += ` AND pessoa.cpf = ${params.cpf}`;
    return sql;
  }

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      let sql: string = `
        SELECT paciente.id
             , pessoa.cpf
             , pessoa.nome
             , CONCAT(telefone.ddd, telefone.numero) as telefoneNumero
          FROM paciente
         INNER JOIN pessoa
            ON pessoa.id = paciente.pessoa_id

          LEFT JOIN pessoa_telefone
            ON pessoa_telefone.deleted_at IS NULL
           AND pessoa_telefone.pessoa_id = pessoa.id
          LEFT JOIN telefone
            ON telefone.id = pessoa_telefone.telefone_id

         WHERE paciente.deleted_at IS NULL`;

      sql += await this.filtroPesquisa(req.query);

      sql += ` GROUP BY pessoa.nome  LIMIT 1000`;

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
        SELECT paciente.id
             , pessoa.cpf
             , pessoa.nome
             , pessoa.data_nascimento as dataNascimento
             , pessoa.sexo
             , paciente.cartao_sus as cartaoSus
             , paciente.tipo_sanguineo as tipoSanguineo
             , paciente.peso
             , paciente.altura
             , pessoa_telefone.id as pessoaTelefoneId
             , CONCAT(telefone.ddd, telefone.numero) as telefoneNumero
             , telefone.tipo as telefoneTipo
          FROM paciente
         INNER JOIN pessoa
            ON pessoa.id = paciente.pessoa_id

          LEFT JOIN pessoa_endereco
            ON pessoa_endereco.deleted_at IS NULL
           AND pessoa_endereco.pessoa_id = pessoa.id
          LEFT JOIN endereco
            ON endereco.id = pessoa_endereco.endereco_id

          LEFT JOIN pessoa_telefone
            ON pessoa_telefone.deleted_at IS NULL
           AND pessoa_telefone.pessoa_id = pessoa.id
          LEFT JOIN telefone
            ON telefone.id = pessoa_telefone.telefone_id

          LEFT JOIN pessoa_email
            ON pessoa_email.deleted_at IS NULL
           AND pessoa_email.pessoa_id = pessoa.id
          LEFT JOIN email
            ON email.id = pessoa_email.email_id
         WHERE paciente.id = :id`;

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
      const numeroTelefone = req.body.telefone;

      delete req.body.nome;
      delete req.body.cpf;
      delete req.body.dataNascimento;
      delete req.body.sexo;
      delete req.body.telefone;

      const pessoaExistente = await Pessoa.findOne({
        where: {
          cpf: cpf
        }
      });

      // Criar Pessoa
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

      // Criar Paciente
      const reg = await Paciente.create(Object.assign(req.body, {pessoaId: pessoaId}));

      // Relacionar telefone com paciente
      if (numeroTelefone) {
        const telefone = Telefone.build(Object.assign({
          ddd: numeroTelefone.slice(0, 2),
          numero: numeroTelefone,
          tipo: 1
        }));
        await telefone.save();

        const pessoaTelefone = PessoaTelefone.build(Object.assign({
          pessoaId: pessoaId,
          telefoneId: telefone.id
        }));
        await pessoaTelefone.save();
      }

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

      await this.db().transaction (async (t: any) => {
        await paciente.save({ transaction: t });
        await pessoa.save({ transaction: t });

        const helper = new HelperPessoa(pessoa.id, t);
        // helper.atualizarEndereco(req.body.telefone);
        await helper.atualizarTelefone(req.body.telefone);
        // helper.atualizarEmail();
      });

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
