import server from "@core/server";
import sequelizeMoment from "@plugins/sequelize/moment";
import moment from "moment";
import morgan from "morgan";

sequelizeMoment("YYYY-MM-DD HH:mm:ss.SSS");

server.environment({path: ".env"});

if (process.env.NODE_ENV !== "test") server.express.use(morgan("dev"));

Date.prototype.toJSON = function () {
  return moment(this).format("YYYY-MM-DD HH:mm:ss.SSS");
};

moment.prototype.toJSON = function () {
  return moment(this).format("YYYY-MM-DD HH:mm:ss.SSS");
};

export default server;
