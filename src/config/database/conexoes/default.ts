import config from "@config/database/config";
import { Auth } from "@core/access_control";
import IDbConnection from "@core/database/idb_connection";
import sequelizeSoftDelete from "@plugins/sequelize/soft_delete";
import sequelizeTimestamp from "@plugins/sequelize/timestamp";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

class ConDefault implements IDbConnection {
  alias: string;
  connection: Sequelize;
  options: SequelizeOptions;

  constructor () {
    this.options = config.default;
  }

  private usuario (): string | undefined {
    if (Auth.authenticated())
      return Auth.user.login;
    else {
      return "SISTEMA_ARSS";
    }
  }

  async config (): Promise<void> {
    this.alias = "default";
    this.connection = new Sequelize(this.options);

    sequelizeSoftDelete(this.connection, {
      deleted: { field: "deleted_at", defaultValue: null, deletedValue: "*"},
      deletedAt: "deleted_at",
      deletedBy: { field: "deleted_by", defaultValue: this.usuario }
    });

    sequelizeTimestamp(this.connection, {
      createdBy: { defaultValue: this.usuario },
      updatedBy: { defaultValue: this.usuario }
    });
  }
}

export default ConDefault;
