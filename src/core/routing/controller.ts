import server from "@config/server";
import Middleware from "@core/decorators/middleware";
import { All, Delete, Get, Head, Options, Patch, Post, Put } from "@core/decorators/request";
import Route from "@core/decorators/route";

export {
  All,
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
}

export default Controller;
