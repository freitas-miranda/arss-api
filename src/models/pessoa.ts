import Usuario from "@models/usuario";

import { Moment } from "moment";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({ tableName: "pessoa" })
class Pessoa extends Model<Pessoa> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nome: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  cpf: string;

  @Column(DataType.DATE)
  dataNascimento: Moment;

  @ForeignKey(() => Usuario)
  @Column
  usuarioId: number;

}

export default Pessoa;
