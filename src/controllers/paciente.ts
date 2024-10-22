import Controller from "@base/controller";
import { Authentication, Delete, Get, Post, Put, Route } from "@core/routing/controller";
import HelperPessoa from "@helpers/pessoa";
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

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      const params = req.query || { };
      let filtro: string = ``;
      let order: string = ` ORDER BY paciente.id DESC`;
      if (params.codigo) {
        filtro += ` AND paciente.id = ${params.codigo}`;
      }
      if (params.nome) {
        filtro += ` AND pessoa.nome LIKE '%${params.nome}%'`;
        order = ` ORDER BY pessoa.nome`;
      }
      if (params.cpf) {
        filtro += ` AND pessoa.cpf = ${params.cpf}`;
      }

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

         WHERE paciente.deleted_at IS NULL
         ${filtro}
         ${order}`;

      const registros = await this.select(sql += " LIMIT 1000" );

      return res.json({registros: registros});
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Get("/existe/:cpf")
  async existe (req: Request, res: Response): Promise<any> {
    try {
      const registro = await this.select(`
        SELECT pessoa.cpf
             , pessoa.nome
          FROM pessoa
         INNER JOIN paciente
            ON paciente.pessoa_id = pessoa.id
         WHERE paciente.deleted_at IS NULL
           AND pessoa.cpf = :cpf
      `, {
        plain: true,
        replacements: {
          cpf: req.params.cpf
        }
      });

      if (!validate.isEmpty(registro)) {
        return res.json({
          erro: `Já existe paciente cadastrado com este CPF <li>${registro.nome}</li>`
        });
      }

      return res.json({"situacao": "Paciente não existe!"});
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Get("/exibir/:id")
  async exibir (req: Request, res: Response): Promise<any> {
    try {
      const sql: string = `
        select paciente.id
             , pessoa.id as pessoaId
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
             , pessoa_email.id as pessoaEmailId
             , email
             , pessoa_endereco.id as pessoaEnderecoId
             , endereco.logradouro as enderecoLogradouro
             , endereco.numero as enderecoNumero
             , endereco.bairro as enderecoBairro
             , endereco.cep as enderecoCep
             , endereco.cidade as enderecoCidade
             , endereco.uf as enderecoUf
          from paciente
         inner join pessoa
            on pessoa.id = paciente.pessoa_id

          left join pessoa_endereco
            on pessoa_endereco.deleted_at is null
           and pessoa_endereco.pessoa_id = pessoa.id
          left join endereco
            on endereco.id = pessoa_endereco.endereco_id

          left join pessoa_telefone
            on pessoa_telefone.deleted_at is null
           and pessoa_telefone.pessoa_id = pessoa.id
          left join telefone
            on telefone.id = pessoa_telefone.telefone_id

          left join pessoa_email
            on pessoa_email.deleted_at is null
           and pessoa_email.pessoa_id = pessoa.id
          left join email
            on email.id = pessoa_email.email_id
         where paciente.id = :id`;

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
      if (erro) return res.status(500).json({ erro });

      const existente = await Paciente.findOne({
        where: {
          "$pessoa.cpf$": req.body.cpf
        },
        include: [
          { model: Pessoa, as: Pessoa.tableName}
        ]
      });

      if (existente) {
        throw new Error(`Já existe paciente cadastrado com este CPF <li>${existente.pessoa.nome}</li>`);
      }

      const nome = req.body.nome;
      const cpf = req.body.cpf;
      const dataNascimento = req.body.dataNascimento;
      const sexo = req.body.sexo;
      const endereco = req.body.endereco;
      const telefone = req.body.telefone;
      const email = req.body.email;

      delete req.body.nome;
      delete req.body.cpf;
      delete req.body.dataNascimento;
      delete req.body.sexo;
      delete req.body.endereco;
      delete req.body.telefone;
      delete req.body.email;

      const pessoaExistente = await Pessoa.findOne({
        where: {
          cpf: cpf
        }
      });

      let pessoaId;
      let pacienteId;
      await this.db().transaction (async (t: any) => {

        // Criar Pessoa
        if (pessoaExistente) {
          pessoaId = pessoaExistente.id;
          pessoaExistente.nome = nome;
          pessoaExistente.dataNascimento = dataNascimento;
          pessoaExistente.sexo = sexo;
          await pessoaExistente.save({ transaction: t });
        } else {
          const pessoa = await Pessoa.create({
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            sexo: sexo
          }, { transaction: t });
          pessoaId = pessoa.id;
        }

        // Criar Paciente
        const reg = await Paciente.create(
          Object.assign(req.body, {pessoaId: pessoaId}),
          { transaction: t }
        );
        pacienteId = reg.id;

        const helper = new HelperPessoa(pessoaId, t);
        await helper.atualizarEndereco(endereco);
        await helper.atualizarTelefone(telefone);
        await helper.atualizarEmail(email);
      });

      return res.json({
        id: pacienteId,
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
        await helper.atualizarEndereco(req.body.endereco);
        await helper.atualizarTelefone(req.body.telefone);
        await helper.atualizarEmail(req.body.email);
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
      if (!reg) this.erro.naoEncontradoParaApagar();

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
