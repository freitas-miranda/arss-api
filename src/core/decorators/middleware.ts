import { MIDDLEWARES_DECORATOR } from "@core/decorators/constants";
import IMiddlewares from "@core/interfaces/middleware";

export function Middleware (middlewares: IMiddlewares | IMiddlewares []) {
  return (target: any, key?: string | symbol) => {
    Reflect.defineMetadata(MIDDLEWARES_DECORATOR, middlewares, target, key);
  };
}

export default Middleware;
