import Session from "@core/session";

export class Auth {
  private static instance: Auth;

  static middlewareAuthentication: any;
  static middlewareAuthorization: any;

  static authenticated (): boolean {
    const req = Session.get("request");

    if (req) return !!req.user;

    return false;
  }

  static init (): Auth {
    if (!Auth.instance)
      Auth.instance = new Auth();

    return Auth.instance;
  }

  static async login (user: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const req = Session.get("request");

      if (req) {
        req.login(user, () => { resolve(); });
      } else reject(new Error("Falha ao registrar a autenticação do usuário!"));
    });
  }

  static get user (): any {
    const req = Session.get("request");

    if (req) return req.user;

    return undefined;
  }
}

export default Auth;
