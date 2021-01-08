import cls from "cls-hooked";
import { NextFunction, Request, Response } from "express";

export class Session {
  private static instance: Session;
  private namespace: cls.Namespace;

  constructor () {
    this.namespace = cls.createNamespace("user-session");
  }

  static bindEmitter (bind: any): void {
    Session.instance.namespace.bindEmitter(bind);
  }

  static get (key: string): any {
    return Session.instance.namespace.get(key);
  }

  static init (): Session {
    if (!Session.instance)
    Session.instance = new Session();

    return Session.instance;
  }

  static middleware (req: Request, res: Response, next: NextFunction) {
    Session.instance.namespace.bindEmitter(req);
    Session.instance.namespace.bindEmitter(res);

    Session.instance.namespace.run(() => {
      Session.instance.namespace.set("request", req);
      Session.instance.namespace.set("response", res);

      next();
    });
  }

  static get namespace (): cls.Namespace {
    return Session.instance.namespace;
  }

  static remove (key: string): void {
    Session.instance.namespace.set(key, undefined);
  }

  static run (callback: (...args: any[]) => void) {
    Session.instance.namespace.run(callback);
  }

  static set (key: string, value: any): void {
    Session.instance.namespace.set(key, value);
  }
}

export default Session;
