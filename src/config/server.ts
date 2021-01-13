import { Auth } from "@core/access_control";
import server from "@core/server";
import middlewareAutenticacao from "@middlewares/autenticacao";
import middlewareAutorizacao from "@middlewares/autorizacao";
import sequelizeMoment from "@plugins/sequelize/moment";
import moment from "moment";
import morgan from "morgan";

sequelizeMoment("YYYY-MM-DD HH:mm:ss.SSS");

Auth.middlewareAuthentication = middlewareAutenticacao;
Auth.middlewareAuthorization = middlewareAutorizacao;

server.environment({path: ".env"});

if (process.env.NODE_ENV !== "test") server.express.use(morgan("common"));

Date.prototype.toJSON = function () {
  return moment(this).format("YYYY-MM-DD HH:mm:ss.SSS");
};

moment.prototype.toJSON = function () {
  return moment(this).format("YYYY-MM-DD HH:mm:ss.SSS");
};

export default server;
