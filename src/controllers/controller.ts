import BaseController, { Middleware } from "@core/routing/controller";
import MiddlewareLogin from "@middlewares/login";
import Bluebird from "bluebird";
import dns from "dns";
import { QueryTypes } from "sequelize";

@Middleware(MiddlewareLogin)
export class Controller extends BaseController {
  protected async isConnected (): Promise<any> {
    return new Bluebird(async (resolve: any, reject: any) => {
      try {
        dns.resolve("www.google.com.br", function (err: any) {
          if (err) resolve(false);
          else resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  protected async select (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.db().query(sql, {
      type: QueryTypes.SELECT,
      ...opcoes
    });

    return query;
  }
}

export default Controller;
