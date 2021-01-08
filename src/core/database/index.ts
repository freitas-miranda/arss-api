import IDbConnection from "@core/database/idb_connection";
import fs from "fs";
import path from "path";

class Database {
  private readonly PATH_CONNECTIONS = path.join(__dirname, "../../config/database/conexoes");

  private connections: any;

  constructor () {
    this.connections = { };
  }

  async config () {
    const files = fs.readdirSync(this.PATH_CONNECTIONS);

    files.forEach(async file => {
      file = path.join(this.PATH_CONNECTIONS, file);

      const stat = fs.statSync(file);

      if (stat.isFile()) {
        try {
          if (path.extname(file) === ".js") {
            const module = await import(file);
            if (module.default) {
              const DbClass = module.default;
              const connection: IDbConnection = new DbClass();

              await <any>connection.config();
              this.connections[connection.alias] = connection;
            }
          }
        } catch (error) {
          throw error;
        }
      }
    });
  }

  connection (alias: string = "default"): any {
    if (!this.connections[alias]) throw new Error("Base de dados não encontrada!");

    return this.connections[alias].connection;
  }
}

export default Database;
