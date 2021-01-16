import path from "path";
import { SequelizeOptions } from "sequelize-typescript";

export default {
  default: <SequelizeOptions>{
    dialect: "mariadb",
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    logging: (process.env.APP_DEBUG === "true") ? console.log : false,
    timezone: process.env.APP_TIMEZONE,
    modelPaths: [
      path.join(__dirname, "../../models"),
    ],
    define: {
      timestamps: false,
      underscored: true,
      paranoid: true
    },
    pool: {
      max: 500,
      min: 0,
      idle: 3000
    }
  }
};
