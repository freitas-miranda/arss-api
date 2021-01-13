import Controller from "@controllers/controller";
import { Get, Route } from "@core/routing/controller";
import { Request, Response } from "express";
import moment from "moment";

@Route("/")
class Api extends Controller {

  @Get()
  async index (_req: Request, res: Response): Promise<any> {
    return res.redirect("/api");
  }

  @Get("/api")
  async api (_req: Request, res: Response): Promise<Response> {
    const { name, description, version } = require("../../../package");
    const time = moment();

    return res.json({
      servidor: name,
      descricao: description,
      versao: version,
      database: await this.checkBancoEstoque(),
      status: true,
      data_vm: time,
      iniciado: (<any>global).timeStart
    });
  }

  private async checkBancoEstoque (): Promise<boolean> {
    try {
      await this.select(`select id from usuario where id = 1`);
      return true;
    } catch (e) {
      return e.message;
    }
  }

}

export default Api;
