import { TokenManager } from "@core/access_control";
import Usuario from "@models/usuario";
import UsuarioToken from "@models/usuario_token";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy } from "passport-http-bearer";

passport.use(new Strategy(
  async (token: string, cb: Function) => {
    try {
      TokenManager.decode(token);

      const usuarioToken = await UsuarioToken.findOne({where: {token: token}});

      if (!usuarioToken) throw new Error("Token inválido!");

      if (!usuarioToken.ativo) throw new Error("Token desativado!");

      const usuario = await Usuario.findByPk(usuarioToken.usuarioId);

      if (!usuario) throw new Error("Usuário não encontrado!");

      return cb(undefined, {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        token: token,
        perfilAcessoId: usuario.perfilAcessoId
      });
    } catch (e) {
      return cb(e);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

function middleware (req: Request, res: Response, next: NextFunction): void {
  passport.authenticate("bearer", (err: Error, usuario: any) => {
    if (err) res.status(401).json({erro: err.message});
    else if (!usuario) res.status(401).json({erro: "Usuário não autenticado!"});
    else {
      req.login(usuario, () => {
        next();
      });
    }
  })(req, res, next);
}

export default middleware;
