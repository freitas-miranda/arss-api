import Controller from "@controllers/controller";
import { Authentication, Get, Post, Route } from "@core/routing/controller";
import EmailConfirmacao, { EmailConfirmacaoAtivo } from "@models/email_confirmacao";
import Usuario from "@models/usuario";
import TemplateEmailConfirmacao from "@templates/email/email_confirmacao";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import { Op } from "sequelize";
import validate from "validate.js";

@Route("/api/perfil")
class PerfilController extends Controller {
  private validacao: object;
  private validacaoSenha: object;

  constructor () {
    super("Perfil");

    this.validacao = {
      nome: { presence: { allowEmpty: false, message: "não informado!" } },
      email: {
        presence: { allowEmpty: false, message: "^E-mail não informado!" },
        email: { message: "^E-mail inválido!" }
      }
    };

    this.validacaoSenha = {
      senhaAtual: { presence: { allowEmpty: false, message: "não informada!" } },
      senhaNova: { presence: { allowEmpty: false, message: "não informada!" } },
      senhaConfirmacao: {
        presence: { allowEmpty: false, message: "não informada!" },
        equality: { attribute: "senhaNova", message: "diferente da senha!" }
      }
    };
  }

  private async tokenEmailConfirmacao (usuarioId: number) {
    const token = jwt.sign({
      sub: usuarioId,
      iat: moment().unix(),
      exp: moment().add(1, "h").unix(),
      aud: process.env.TOKEN_AUDIENCE,
      iss: process.env.TOKEN_ISSUER
    }, process.env.APP_KEY);

    return token;
  }

  @Authentication()
  @Get("/exibir")
  async exibir (req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        attributes: ["email", "nome"]
      });

      if (!usuario) throw new Error("Usuário não encontrado!");

      const emailConfirmacao = await EmailConfirmacao.findOne({
        where: {
          usuarioId: req.user.id,
          ativo: EmailConfirmacaoAtivo.Sim,
          dataVencimento: {
            [Op.gt]: moment()
          }
        },
        order: [["id", "DESC"]]
      });

      return res.json({
        ...usuario.toJSON(),
        emailConfirmacao: !!emailConfirmacao
      });
    } catch (e) {
      return res.json({ erro: e.message, tipo: e.name });
    }
  }

  @Authentication()
  @Post("/salvar")
  async salvar (req: Request, res: Response): Promise<Response> {
    try {
      const erros = validate(req.body, this.validacao);

      if (erros) return res.json({ erro: erros });

      const usuario = await Usuario.findByPk(req.user.id);

      if (!usuario) throw new Error("Usuário não encontrado!");

      if (usuario.senha !== req.body.senhaAtual) {
        return res.json({ erro: { senhaAtual: ["Senha incorreta!"] } });
      }

      usuario.nome = req.body.nome;

      if (req.body.senhaNova) {
        const erroSenha = validate(req.body, this.validacaoSenha);

        if (erroSenha) return res.json({ erro: erroSenha });

        usuario.senha = req.body.senhaNova;
      }

      let emailConfirmacao = await EmailConfirmacao.findOne({
        where: {
          usuarioId: req.user.id,
          ativo: EmailConfirmacaoAtivo.Sim,
          dataVencimento: {
            [Op.gt]: moment()
          }
        },
        order: [["id", "DESC"]]
      });

      const token = emailConfirmacao ? emailConfirmacao.token : await this.tokenEmailConfirmacao(usuario.id);

      await this.db().transaction (async (t: any) => {
        await usuario.save({ transaction: t });

        if (usuario.email !== req.body.email && !emailConfirmacao) {
          emailConfirmacao = new EmailConfirmacao();

          emailConfirmacao.token = token;
          emailConfirmacao.usuarioId = usuario.id;
          emailConfirmacao.emailAtual = usuario.email;
          emailConfirmacao.emailNovo = req.body.email;
          emailConfirmacao.emailNovo = req.body.email;
          emailConfirmacao.dataVencimento = moment().add(1, "h");
          emailConfirmacao.ativo = EmailConfirmacaoAtivo.Sim;

          await emailConfirmacao.save({ transaction: t });
        }

        if (usuario.email !== req.body.email) {
          let link;

          if (process.env.NODE_ENV === "production") {
            link = `${process.env.APP_HOST}/confirmar-email/${token}`;
          } else {
            link = `${process.env.APP_HOST}:8080/confirmar-email/${token}`;
          }

          await this.email.enviar(req.body.email, "Alteração de E-mail", TemplateEmailConfirmacao(usuario.nome, link));
        }
      });

      let mensagem = `Perfil alterado com sucesso!`;

      if (usuario.email !== req.body.email) {
        mensagem += `<br>Foi enviado um e-mail para <b>${req.body.email}</b> para confirmação da alteração.`;
      }

      return res.json({
        mensagem,
        nome: usuario.nome,
        email: usuario.email,
        emailConfirmacao: !!emailConfirmacao
      });
    } catch (e) {
      return res.json({ erro: e.message, tipo: e.name });
    }
  }

  @Authentication()
  @Post("/reenviar")
  async reenviar (req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await Usuario.findByPk(req.user.id);

      if (!usuario) throw new Error("Usuário não encontrado!");

      const emailConfirmacao = await EmailConfirmacao.findOne({
        where: {
          usuarioId: req.user.id,
          ativo: EmailConfirmacaoAtivo.Sim,
          dataVencimento: {
            [Op.gt]: moment()
          }
        },
        order: [["id", "DESC"]]
      });

      if (!emailConfirmacao) throw new Error("E-mail de confirmação não encontrado!");

      let link;
      if (process.env.NODE_ENV === "production") {
        link = `${process.env.APP_HOST}/confirmar-email/${emailConfirmacao.token}`;
      } else {
        link = `${process.env.APP_HOST}:${process.env.CLIENT_PORT}/confirmar-email/${emailConfirmacao.token}`;
      }

      await this.email.enviar(emailConfirmacao.emailNovo, "Alteração de E-mail", TemplateEmailConfirmacao(usuario.nome, link));

      return res.json({ mensagem: `Foi enviado um e-mail para <b>${emailConfirmacao.emailNovo}</b> para confirmação da alteração.`, });
    } catch (e) {
      return res.json({ erro: e.message, tipo: e.name });
    }
  }

  @Post("/confirmar-email")
  async confirmarEmail (req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.token) throw new Error("Token não informado!");

      const emailConfirmacao = await EmailConfirmacao.findOne({
        where: {
          token: req.body.token
        }
      });

      if (!emailConfirmacao) throw new Error("E-mail de confirmação não encontrado!");

      if (emailConfirmacao.dataVencimento < moment()) {
        throw new Error("Solicitação expirada!");
      }

      if (emailConfirmacao.ativo === EmailConfirmacaoAtivo.Nao) {
        throw new Error("E-mail já confirmado!");
      }

      const usuario = await Usuario.findByPk(emailConfirmacao.usuarioId);

      if (!usuario) throw new Error("Usuário não encontrado!");

      await this.db().transaction (async (t: any) => {
        await usuario.save({ transaction: t });

        await emailConfirmacao.save({ transaction: t });
      });

      return res.json({ mensagem: "E-mail alterado com sucesso!" });
    } catch (e) {
      return res.json({ erro: e.message, tipo: e.name });
    }
  }
}

export default PerfilController;
