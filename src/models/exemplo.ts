import SequelizeModel from "@core/database/model";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum ExemploStatus {
  Inativo = 0,
  Ativo = 1
}

@Table({ tableName: "exemplo" })
class Exemplo extends SequelizeModel<Exemplo> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  descricao: string;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  status: number;

  @Column(DataType.STRING)
  createdBy: string;

  @Column(DataType.STRING)
  updatedBy: string;

  @Column(DataType.STRING)
  deletedBy: string;
}

export default Exemplo;
