import server from "@config/server";
import Authentication from "@core/decorators/authentication";
import Authorization from "@core/decorators/authorization";
import Middleware from "@core/decorators/middleware";
import { All, Delete, Get, Head, Options, Patch, Post, Put } from "@core/decorators/request";
import Route from "@core/decorators/route";

export {
  All,
  Authentication,
  Authorization,
  Delete,
  Get,
  Head,
  Middleware,
  Options,
  Patch,
  Post,
  Put,
  Route
};

export abstract class Controller {

  protected db (alias?: string): any {
    return server.database.connection(alias);
  }

  protected abstract allowed (login?: number, rule?: number): Promise<boolean>;

  protected abstract auth (login: string, password: string): Promise<any>;
}

export default Controller;
