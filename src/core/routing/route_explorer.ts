import IMiddleware from "@core/interfaces/middleware";
import * as controllerLoader from "@core/routing/controller_loader";
import Session from "@core/session";
import express from "express";
import glob from "glob";
import path from "path";

async function createRouter (controllerPath: string, server: express.Express): Promise<void> {
  const ControllerClass = (await import(controllerPath)).default;

  if (ControllerClass) {
    const controllerPath = controllerLoader.path(ControllerClass);

    if (controllerPath) {
      const methods = controllerLoader.methods(ControllerClass);

      if (methods.length) {
        const router = express.Router();
        const controller = new ControllerClass();
        const middlewares = controllerLoader.middlewares(ControllerClass);

        router.use(Session.middleware);

        middlewares.forEach((middleware: IMiddleware) => {
          router.use(middleware);
        });

        methods.forEach((method: controllerLoader.Method) => {
          (<any>router)[method.requestMethod](method.path, method.middlewares, controller[method.methodName].bind(controller));
        });

        server.use(controllerPath, router);
      }
    }
  }
}

export default async function (server: express.Express) {
  const controllersPath = path.join(path.resolve("./"), "/dist/src/controllers/**/*js");

  return new Promise((resolve: any, reject: any) => {
    glob(controllersPath, async (err: Error, controllers: string[]) => {
      if (err) reject(err);

      for (let index = 0; index < controllers.length; index++) {
        await createRouter(controllers[index], server);
      }

      resolve();
    });
  });
}
