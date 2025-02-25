import Controller from "@base/controller";
import { Auth } from "@core/access_control";
import { Authentication, Get, Put, Route } from "@core/routing/controller";
import Agendamento from "@models/agendamento";
import { grupo } from "@models/opcao_item";
import { PerfilAcesso } from "@models/perfil";
import { Request, Response } from "express";
import moment from "moment";
import validate from "validate.js";

@Route("/api/agendamento/")
export class AgendamentoController extends Controller {
  private readonly validacaoConfirmar: any;
  private readonly validacaoCancelar: any;

  constructor () {
    super("Agendamento");

    this.validacaoConfirmar = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      }
    };

    this.validacaoCancelar = {
      id: {
        presence: {allowEmpty: false, message: "^ID não informado!"},
        numericality: {notValid: "^ID inválido!"}
      },
      motivo: {
        presence: {allowEmpty: false, message: "não informado!"},
      }
    };
  }

  @Authentication()
  @Get("/dropdown")
  async dropdown (_req: Request, res: Response): Promise<Response> {
    try {
      return res.json({
        tipoAgendamento: await this.opcoes(grupo.tipoAgendamento),
        statusAgendamento: await this.opcoes(grupo.statusAgendamento),
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  private usuarioPaciente (): boolean {
    return (Auth.user.perfilAcessoId === PerfilAcesso.Paciente);
  }

  private async filtroPesquisa (params: any): Promise<string> {
    params = params || { };
    let sql: string = ``;
    if (params.dia) sql += ` and a.dia = '${params.dia}'`;
    if (params.tipoAgendamento) sql += ` and a.tipo = ${params.tipoAgendamento}`;
    if (params.statusAgendamento) sql += ` and a.status = ${params.statusAgendamento}`;
    if (params.paciente) sql += ` and pPaciente.nome like '%${params.paciente}%'`;
    if (params.medico) sql += ` and pMedico.nome like '%${params.medico}%'`;

    if (this.usuarioPaciente()) {
      sql += ` and usuario.id = ${Auth.user.id}`;
    }

    return sql;
  }

  @Authentication()
  @Get("/listar")
  async listar (req: Request, res: Response): Promise<any> {
    try {
      let sql: string = `
        select a.id
             , a.status as statusId
             , oStatus.descricao as statusAgendamento
             , oTipo.descricao as tipo
             , a.dia
             , a.hora
             , pPaciente.nome as paciente
             , pMedico.nome as medico
             , e.descricao as especialidade
          from agendamento a
         inner join opcao_item oTipo
            on oTipo.opcao_id = 5 -- Tipo Agendamento
           and oTipo.codigo = a.tipo
         inner join opcao_item oStatus
            on oStatus.opcao_id = 6 -- Status Agendamento
           and oStatus.codigo = a.status
         inner join paciente
            on a.paciente_id = paciente.id
         inner join pessoa pPaciente
            on paciente.pessoa_id = pPaciente.id
         inner join especialidade e
            on a.especialidade_id = e.id
         inner join medico
            on a.medico_id = medico.id
         inner join profissional_saude ps
            on medico.profissional_saude_id = ps.id
         inner join pessoa pMedico
            on ps.pessoa_id = pMedico.id
          left join usuario
            on usuario.deleted_at is null
           and usuario.id = pPaciente.usuario_id
         where a.deleted_at is null`;

      sql += await this.filtroPesquisa(req.query);

      sql += ` order by a.id limit 1000`;

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
      let sql: string = `
        select a.id
             , a.status as statusId
             , oStatus.descricao as statusAgendamento
             , oTipo.descricao as tipo
             , a.dia
             , a.hora
             , pPaciente.nome as paciente
             , CONCAT(telefone.ddd, telefone.numero) as telefonePaciente
             , pMedico.nome as medico
             , e.descricao as especialidade
             , a.observacao
          from agendamento a
         inner join opcao_item oTipo
            on oTipo.opcao_id = 5 -- Tipo Agendamento
           and oTipo.codigo = a.tipo
         inner join opcao_item oStatus
            on oStatus.opcao_id = 6 -- Status Agendamento
           and oStatus.codigo = a.status
         inner join paciente
            on a.paciente_id = paciente.id
         inner join pessoa pPaciente
            on paciente.pessoa_id = pPaciente.id
         inner join especialidade e
            on a.especialidade_id = e.id
         inner join medico
            on a.medico_id = medico.id
         inner join profissional_saude ps
            on medico.profissional_saude_id = ps.id
         inner join pessoa pMedico
            on ps.pessoa_id = pMedico.id
          left join pessoa_telefone pt
            on pt.deleted_at is null
           and pt.pessoa_id = pPaciente.id
          left join telefone
            on telefone.id = pt.telefone_id
          left join usuario
            on usuario.deleted_at is null
           and usuario.id = pPaciente.usuario_id
         where a.id = :id`;

      if (this.usuarioPaciente()) {
        sql += ` and usuario.id = ${Auth.user.id}`;
      }

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
  @Put("/confirmar")
  async confirmar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoConfirmar);
      if (erro) return res.status(500).json({ erro });

      const agendamento = await Agendamento.findByPk(req.body.id);
      if (!agendamento) {
        this.erro.create(`Agendamento não encontrado para confirmar! Id: ${req.body.id}`);
      }
      agendamento.status = 2; // 2-Confirmado
      agendamento.confirmacao = moment();
      agendamento.responsavel = Auth.user.email.slice(0, 45);

      await agendamento.save();

      return res.json({
        id: agendamento.id,
        mensagem: "Agendamento confirmado!"
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Put("/cancelar")
  async cancelar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoCancelar);
      if (erro) return res.status(500).json({ erro });

      const agendamento = await Agendamento.findByPk(req.body.id);
      if (!agendamento) {
        this.erro.create(`Agendamento não encontrado para recusar! Id: ${req.body.id}`);
      }
      agendamento.status = 5; // 5-Cancelado
      agendamento.observacao = req.body.motivo;
      agendamento.confirmacao = null;
      agendamento.responsavel = null;

      await agendamento.save();

      return res.json({
        id: agendamento.id,
        mensagem: "Agendamento recusado!"
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Authentication()
  @Put("/iniciar")
  async iniciar (req: Request, res: Response): Promise<any> {
    try {
      const erro = validate(req.body, this.validacaoConfirmar);
      if (erro) return res.status(500).json({ erro });

      const agendamento = await Agendamento.findByPk(req.body.id);
      if (!agendamento) {
        this.erro.create(`Agendamento não encontrado para voltar ao inicio! Id: ${req.body.id}`);
      }
      agendamento.status = 1; // 1-Solicitado
      agendamento.confirmacao = null;
      agendamento.responsavel = null;
      agendamento.observacao = null;

      await agendamento.save();

      return res.json({
        id: agendamento.id,
        mensagem: "Status alterado para solicitado!"
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default AgendamentoController;
