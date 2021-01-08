import { NextFunction, Request, Response } from "express";
import validate from "validate.js";

const middleware = async function (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  if (!validate.isEmpty((<any>req).user)) (<any>global).login = (<any>req).user.login;
  else {
    if (["POST", "PUT", "DELETE"].indexOf(req.method) !== -1) {
      if (validate.isEmpty(req.body.login)) {
        return res.status(500).json({ erro: "Login não informado." });
      }

      (<any>global).login = req.body.login;
    }
  }

  return next();

  return res.status(500).json({ erro: "Login não informado." });
};

export default middleware;
