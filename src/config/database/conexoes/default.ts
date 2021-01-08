import config from "@config/database/config";
import IDbConnection from "@core/database/idb_connection";
import sequelizeSoftDelete from "@plugins/sequelize/soft_delete";
import sequelizeTimestamp from "@plugins/sequelize/timestamp";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

class DbLocal implements IDbConnection {
  alias: string;
  connection: Sequelize;
  options: SequelizeOptions;

  constructor () {
    this.options = config.default;
  }

  async config (): Promise<void> {
    this.alias = "default";
    this.connection = new Sequelize(this.options);

    sequelizeSoftDelete(this.connection, {
      deleted: { field: "deleted_at", defaultValue: null, deletedValue: "*"},
      deletedAt: "deleted_at",
      deletedBy: { field: "deleted_by" }
    });

    sequelizeTimestamp(this.connection, { });
  }
}

export default DbLocal;
