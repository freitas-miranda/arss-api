import Controller from "@base/controller";
import { Auth, TokenManager } from "@core/access_control";
import { Authentication, Get, Post, Route } from "@core/routing/controller";
import RecuperacaoSenha, { RecuperacaoSenhaAtivo } from "@models/recuperacao_senha";
import Usuario, { UsuarioAtivo } from "@models/usuario";
import UsuarioSolicitacao from "@models/usuario_solicitacao";
import UsuarioToken from "@models/usuario_token";
import TemplateConfirmarCadastro from "@templates/email/confirmacao_email";
import TemplateRedefinicaoSenha from "@templates/email/redefinicao_senha";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import validate from "validate.js";

@Route("/api/controle-acesso/autenticacao")
class AutenticacaoController extends Controller {
  private validacaoLogin: object;
  private validacaoCadastrar: object;
  private validacaoConfirmarCadastro: object;
  private validacaoRecuperarSenha: object;
  private validacaoAlterarSenha: object;

  constructor () {
    super("Autenticação");

    this.validacaoLogin = {
      email: {
        presence: { allowEmpty: false, message: "^E-mail não informado!" },
        email: { message: "^E-mail inválido!" }
      },
      senha: { presence: { allowEmpty: false, message: "não informada!" } }
    };

    this.validacaoCadastrar = {
      nome: { presence: { allowEmpty: false, message: "não informado!" } },
      email: {
        presence: { allowEmpty: false, message: "^E-mail não informado!" },
        email: { message: "^E-mail inválido!" }
      }
    };

    this.validacaoConfirmarCadastro = {
      senha: { presence: { allowEmpty: false, message: "não informada!" } },
      senhaConfirmacao: {
        presence: { allowEmpty: false, message: "não informada!" },
        equality: { attribute: "senha", message: "diferente da senha!" }
      }
    };

    this.validacaoRecuperarSenha = {
      email: {
        presence: { allowEmpty: false, message: "^E-mail não informado!" },
        email: { message: "^E-mail inválido!" }
      }
    };

    this.validacaoAlterarSenha = {
      senha: { presence: { allowEmpty: false, message: "não informada!" } },
      senhaConfirmacao: {
        presence: { allowEmpty: false, message: "não informada!" },
        equality: { attribute: "senha", message: "diferente da senha!" }
      }
    };
  }

  private formatarIp (ip: string): string {
    return ip.replace("::ffff:", "");
  }

  private async gerarToken (usuarioId: number, ip: string, agente: string) {
    const encoded = TokenManager.encode(usuarioId, {usuarioId});

    const usuarioToken = new UsuarioToken();

    usuarioToken.usuarioId = usuarioId;
    usuarioToken.token = encoded.token;
    usuarioToken.dataCadastro = moment.unix(encoded.options.iat);
    usuarioToken.dataVencimento = moment.unix(encoded.options.exp);
    usuarioToken.ip = ip;
    usuarioToken.agente = agente;

    await usuarioToken.save();

    return usuarioToken.token;
  }

  private async tokenConfirmarCadastro (usuarioSolicitacaoEmail: string) {
    const token = jwt.sign({
      sub: usuarioSolicitacaoEmail,
      iat: moment().unix(),
      aud: process.env.TOKEN_AUDIENCE,
      iss: process.env.TOKEN_ISSUER
    }, process.env.APP_KEY);

    return token;
  }

  private async tokenRecuperarSenha (usuarioId: number) {
    const token = jwt.sign({
      sub: usuarioId,
      iat: moment().unix(),
      exp: moment().add(1, "h").unix(),
      aud: process.env.TOKEN_AUDIENCE,
      iss: process.env.TOKEN_ISSUER
    }, process.env.APP_KEY);

    return token;
  }

  @Get("/obter-solicitacao/:token")
  async obterSolicitacao (req: Request, res: Response): Promise<Response> {
    try {
      const solicitacao = await UsuarioSolicitacao.findOne({
        attributes: ["id", "email", "nome", "dataConfirmacao"],
        where: {
          token: req.params.token
        }
      });

      if (!solicitacao) throw new Error("Solicitação de cadastro não encontrada!");

      if (solicitacao.dataConfirmacao) throw new Error("Solicitação de cadastro já confirmada!");

      return res.json(solicitacao);
    } catch (e) {
      return res.json({ erro: e.message });
    }
  }

  @Post("/confirmar-cadastro")
  async confirmarCadastro (req: Request, res: Response): Promise<Response> {
    const erros = validate(req.body, this.validacaoConfirmarCadastro);

    if (erros) return res.json({ erro: erros });

    try {
      const solicitacao = await UsuarioSolicitacao.findByPk(req.body.solicitacaoId);

      if (!solicitacao) throw new Error("Solicitação de cadastro não encontrada!");

      const dadosConfirmacao = Object.assign({}, req.body);

      delete dadosConfirmacao.senha;
      delete dadosConfirmacao.senhaConfirmacao;

      const usuarioCadastrado = await Usuario.findOne({
        where: {
          email: req.body.email
        }
      });

      if (usuarioCadastrado) throw new Error("CPF/CNPJ já cadastrado!");

      const usuario = new Usuario();

      usuario.nome = solicitacao.nome;
      usuario.email = solicitacao.email;
      usuario.senha = req.body.senha;
      usuario.ativo = UsuarioAtivo.Sim;

      await this.db().transaction (async (t: any) => {
        await usuario.save({ transaction: t });

        await UsuarioSolicitacao.update({
          dataConfirmacao: moment(),
          usuarioId: usuario.id,
          dadosConfirmacao: JSON.stringify(dadosConfirmacao)
        }, {
          where: {
            id: req.body.solicitacaoId
          },
          transaction: t
        });
      });

      return res.json({ mensagem: "Cadastro efetuado com sucesso!" });
    } catch (e) {
      return res.json({ erro: e.message || e });
    }
  }

  @Post("/cadastrar")
  async cadastrar (req: Request, res: Response): Promise<Response> {
    const erros = validate(req.body, this.validacaoCadastrar);

    if (erros) return res.json({ erro: erros });

    try {
      const usuario = await Usuario.findOne({
        where: {
          email: req.body.email
        }
      });

      if (usuario) {
        throw { email: ["E-mail já cadastrado!"] };
      }

      const solicitacao = await UsuarioSolicitacao.findOne({
        where: {
          email: req.body.email
        }
      });

      let token;

      if (solicitacao) token = solicitacao.token;
      else token = await this.tokenConfirmarCadastro(req.body.email);

      let link;
      if (process.env.NODE_ENV === "production") {
        link = `${process.env.APP_HOST}/confirmar-cadastro/${token}`;
      } else {
        link = `${process.env.APP_HOST}:${process.env.CLIENT_PORT}/confirmar-cadastro/${token}`;
      }

      if (solicitacao) {
        await this.email.enviar(req.body.email, "Confirmação de Cadastro", TemplateConfirmarCadastro(req.body.nome, link));

        return res.json({ mensagem: "E-mail de confirmação reenviado com sucesso!" });
      } else {
        const usuarioSolicitacao = new UsuarioSolicitacao();

        usuarioSolicitacao.token = token;
        usuarioSolicitacao.nome = req.body.nome;
        usuarioSolicitacao.email = req.body.email;

        await usuarioSolicitacao.save();

        await this.email.enviar(req.body.email, "Confirmação de Cadastro", TemplateConfirmarCadastro(req.body.nome, link));

        return res.json({ mensagem: `Você receberá um e-mail em <b>${req.body.email}</b> com um link para confirmar seu cadastro.` });
      }
    } catch (e) {
      return res.json({ erro: e.message || e });
    }
  }

  @Post("/login")
  async login (req: Request, res: Response): Promise<Response> {
    const erros = validate(req.body, this.validacaoLogin);

    if (erros) return res.json({ erro: erros });

    try {

      const usuario = await this.auth(
        req.body.email,
        req.body.senha,
        true
      );

      const token = await this.gerarToken(
        usuario.id,
        this.formatarIp(req.ip),
        <string>req.headers["user-agent"]);

      return res.json({
        token,
        nome: usuario.nome,
        perfil: usuario.perfilAcessoId
      });
    } catch (e) {
      return res.json({ erro: e.message || e });
    }
  }

  @Get("/obter-recuperacao/:token")
  async obterRecuperacao (req: Request, res: Response): Promise<Response> {
    try {
      const recuperacao = await RecuperacaoSenha.findOne({
        where: {
          token: req.params.token
        }
      });

      if (!recuperacao) throw new Error("Solicitação de recuperação de senha não encontrada!");

      if (recuperacao.ativo === RecuperacaoSenhaAtivo.Nao) throw new Error("Solicitação de recuperação de senha já foi utilizada. Caso seja necessário, recupere a senha novamente!");

      if (moment().unix() >= moment(recuperacao.dataVencimento).unix()) throw new Error("Solicitação de recuperação de senha expirada. Caso seja necessário, recupere a senha novamente!");

      const usuario = await Usuario.findByPk(recuperacao.usuarioId, {
        attributes: ["id", "nome", "email"]
      });

      return res.json(usuario);
    } catch (e) {
      return res.json({ erro: e.message });
    }
  }

  @Post("/recuperar-senha")
  async recuperarSenha (req: Request, res: Response): Promise<Response> {
    const erros = validate(req.body, this.validacaoRecuperarSenha);

    if (erros) return res.json({ erro: erros });

    try {
      const usuario = await Usuario.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!usuario) {
        throw { email: ["E-mail não cadastrado!"] };
      }

      if (usuario.ativo === UsuarioAtivo.Nao) throw new Error("Cadastro não está habilitado!");

      await RecuperacaoSenha.update({
        ativo: RecuperacaoSenhaAtivo.Nao
      }, {
        where: {
          usuarioId: usuario.id,
          ativo: RecuperacaoSenhaAtivo.Sim
        }
      });

      const token = await this.tokenRecuperarSenha(usuario.id);
      const recuperacao = new RecuperacaoSenha();

      recuperacao.token = token;
      recuperacao.usuarioId = usuario.id;
      recuperacao.dataVencimento = moment().add(1, "h");
      recuperacao.ativo = RecuperacaoSenhaAtivo.Sim;

      await recuperacao.save();

      let link;
      if (process.env.NODE_ENV === "production") {
        link = `${process.env.APP_HOST}/alterar-senha/${token}`;
      } else {
        link = `${process.env.APP_HOST}:${process.env.CLIENT_PORT}/alterar-senha/${token}`;
      }

      await this.email.enviar(req.body.email, "Recuperação de Senha", TemplateRedefinicaoSenha(usuario.nome, link));

      return res.json({ mensagem: `Você receberá um e-mail em <b>${req.body.email}</b> com um link para alteração de senha.` });
    } catch (e) {
      return res.json({ erro: e.message || e });
    }
  }

  @Post("/redefinir-senha")
  async redefinirSenha (req: Request, res: Response): Promise<Response> {
    const erros = validate(req.body, this.validacaoAlterarSenha);

    if (erros) return res.json({erro: erros});

    try {
      await this.db().transaction (async (t: any) => {
        await Usuario.update({
          senha: req.body.senha
        }, {
          where: {
            id: req.body.id,
          },
          transaction: t
        });

        await RecuperacaoSenha.update({
          ativo: RecuperacaoSenhaAtivo.Nao
        }, {
          where: {
            usuarioId: req.body.id
          },
          transaction: t
        });
      });

      return res.json({ mensagem: "Senha alterada com sucesso!" });
    } catch (e) {
      return res.json({ erro: e.message });
    }
  }

  @Authentication()
  @Post("/logout")
  async logout (req: Request, res: Response): Promise<Response> {
    if (Auth.authenticated()) {
      const usuarioToken = await UsuarioToken.findOne({ where: { token: req.user.token } });

      if (!usuarioToken) console.error(`Token ${req.user.token} não encontrado ao efetuar logout do usuário ${req.user.login}`);

      if (usuarioToken.ativo && moment() < usuarioToken.dataVencimento) {
        usuarioToken.ativo = false;

        await usuarioToken.save();
      }
    }

    return res.json({ mensagem: "Usuário desconectado!" });
  }
}

export default AutenticacaoController;
