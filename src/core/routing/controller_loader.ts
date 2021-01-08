import {
  MIDDLEWARES_DECORATOR,
  ROUTE_DECORATOR } from "@core/decorators/constants";
import IMiddleware from "@core/interfaces/middleware";

export interface Method {
  methodName: string;
  middlewares: IMiddleware[];
  path: string;
  requestMethod: string;
}

export function middlewares (controllerClass: any, propertyKey?: string): IMiddleware [] {
  const middlewares: IMiddleware[] = [ ];

  const middleware = Reflect.getMetadata(MIDDLEWARES_DECORATOR, controllerClass, propertyKey);

  if (middleware) middlewares.push(middleware);

  return middlewares;
}

export function path (controllerClass: any): string {
  return Reflect.getMetadata(ROUTE_DECORATOR, controllerClass);
}

export function methods (controllerClass: any): Method[] {
  const methods: Method[] = [ ];

  const properties = Object.getOwnPropertyNames(controllerClass.prototype);

  properties.forEach((property: string) => {
    const metadata = Reflect.getMetadata(ROUTE_DECORATOR, controllerClass.prototype, property);

    if (metadata) methods.push({
      methodName: property,
      middlewares: middlewares(controllerClass.prototype, property),
      path: metadata.path,
      requestMethod: metadata.method
    });
  });

  return methods;
}
