import { ROUTE_DECORATOR } from "@core/decorators/constants";

const enum RequestMethod {
  POST = "post",
  GET = "get",
  DELETE = "delete",
  PUT = "put",
  PATCH = "path",
  OPTIONS = "options",
  HEAD = "head",
  ALL = "all"
}

export const RequestMapping = (metadata: any): any => {
  metadata.path = metadata.path || "/";

  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROUTE_DECORATOR, metadata, target, key);

    return descriptor;
  };
};

const createMappingDecorator = (method: RequestMethod) => (path?: string): MethodDecorator => {
  return RequestMapping({ path,  method });
};

export const Post = createMappingDecorator(RequestMethod.POST);

export const Get = createMappingDecorator(RequestMethod.GET);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const All = createMappingDecorator(RequestMethod.ALL);
