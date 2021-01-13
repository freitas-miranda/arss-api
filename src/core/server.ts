import Auth from "@core/access_control/auth";
import Database from "@core/database";
import routeExplorer from "@core/routing/route_explorer";
import Session from "@core/session";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv, { DotenvConfigOptions } from "dotenv";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import moment from "moment";
import passport from "passport";
import path from "path";

export class Server {
  private env: boolean;
  private httpServer: http.Server;

  readonly database: Database;
  readonly express: express.Express;
  readonly version: string;

  constructor () {
    this.database = new Database();
    this.express = express();

    this.version = this.getVersion();

    Auth.init();
    Session.init();
  }

  private getVersion () {
    const filename = path.join(path.resolve("./"), "package.json");

    const data = fs.readFileSync(filename, "utf8");

    const packageJson = JSON.parse(data);

    return packageJson.version;
  }

  private middlewares () {
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(helmet());

    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());

    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  private static () {
    const publicPath = path.join(__dirname, "../../../public");

    this.express.use(express.static(publicPath));
    this.express.get("*", (_req: express.Request, res: express.Response) => res.sendFile(path.join(publicPath, "index.html")));
  }

  environment (config: DotenvConfigOptions) {
    dotenv.config(config);
    this.env = true;
  }

  async start () {
    if (!this.env) throw new Error("Arquivo de configuração não encontrado!");

    (<any>global).timeStart = moment();

    this.middlewares();

    await this.database.config();

    await routeExplorer(this.express);

    this.static();

    this.httpServer = this.express.listen(process.env.APP_PORT, () => {
      console.log(`O Servidor esta executando na porta ${process.env.APP_PORT}!`);
    });
  }

  public stop () {
    this.httpServer.close();
  }
}

export default new Server();
