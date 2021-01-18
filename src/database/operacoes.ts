import server from "@config/server";

import { QueryTypes } from "sequelize";

class DbIgerp {

  private con (): any {
    return server.database.connection();
  }

  async select (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.con().query(sql, {
      type: QueryTypes.SELECT,
      ...opcoes
    });
    return query;
  }

  async selectRow (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.con().query(sql, {
      type: QueryTypes.SELECT,
      plain: true,
      ...opcoes
    });
    return query;
  }

  async insert (sql: string, opcoes: any = { }): Promise<any> {
    const inserted = await this.con().query(sql, {
      type: QueryTypes.INSERT,
      ...opcoes
    });
    return inserted[1];
  }

  async insertReturnId (sql: string, opcoes: any = {}): Promise<any> {
    const inserted = await this.con().query(sql, {
      type: QueryTypes.INSERT,
      ...opcoes
    });
    return inserted[0];
  }

  async update (sql: string, opcoes: any = { }): Promise<any> {
    const updated = await this.con().query(sql, {
      type: QueryTypes.UPDATE,
      ...opcoes
    });
    return updated[1];
  }

}

export default DbIgerp;
