import { Auth } from "@core/access_control";
import HelperAutorizacao from "@helpers/autorizacao";
import { NextFunction, Request, Response } from "express";

const middleware = async function (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const helperAutorizacao = new HelperAutorizacao();

  if (!Auth.user) return res.status(401).json({erro: "Usuário não autenticado!"});

  if (await helperAutorizacao.possuiAcessoUrl(Auth.user.id, req.baseUrl, (<any>req)._parsedUrl.pathname)) {
    return next();
  }

  return res.status(403).json({erro: "Usuário não autorizado!"});
};

export default middleware;
