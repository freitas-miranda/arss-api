import jwt from "jsonwebtoken";
import moment, { DurationInputArg2 } from "moment";

class TokenManager {
  private constructor () { }

  static encode (user: string | number, payload: object): any {
    if (!process.env.APP_KEY) throw new Error("Chave de criptografia não definida no arquivo .env!");
    if (!process.env.TOKEN_EXP) throw new Error("Tempo de expiração do token não definido no arquivo .env!");

    const split = process.env.TOKEN_EXP.split(" ");

    const unit = <DurationInputArg2>split[1];
    const length = split[0];

    const options = Object.assign({
      sub: user,
      iat: moment().unix(),
      exp: moment().add(length, unit).unix(),
      aud: process.env.TOKEN_AUDIENCE,
      iss: process.env.TOKEN_ISSUER
    }, payload);

    const token = jwt.sign(options, process.env.APP_KEY);

    return {token, options};
  }

  static decode (token: string): object {
    try {
      return jwt.verify(token, process.env.APP_KEY) as object;
    } catch (e) {
      throw new Error("Token inválido ou expirado!");
    }
  }
}

export default TokenManager;
