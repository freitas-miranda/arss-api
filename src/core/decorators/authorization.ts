import { AUTHORIZATION_DECORATOR } from "@core/decorators/constants";

export function Authorization () {
  return (target: any, key?: string | symbol) => {
    Reflect.defineMetadata(AUTHORIZATION_DECORATOR, true, target, key);
  };
}

export default Authorization;
