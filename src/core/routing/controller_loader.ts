import { Auth } from "@core/access_control";
import {
  AUTHENTICATION_DECORATOR,
  AUTHORIZATION_DECORATOR,
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

  const authentication = (Reflect.getMetadata(AUTHENTICATION_DECORATOR, controllerClass, propertyKey));

  if (authentication) {
    if (!Auth.middlewareAuthentication) {
      console.log("Decorator de autenticação definido sem middleware padrão para autenticação!");
    } else {
      middlewares.push(Auth.middlewareAuthentication);
    }
  }

  const autorization = (Reflect.getMetadata(AUTHORIZATION_DECORATOR, controllerClass, propertyKey));

  if (autorization) {
    if (!Auth.middlewareAuthorization) {
      console.log("Decorator de autorização definido sem middleware padrão para autorização!");
    } else {
      middlewares.push(Auth.middlewareAuthorization);
    }
  }

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
