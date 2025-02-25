import Usuario from "@models/usuario";

import { Moment } from "moment";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
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

  @AllowNull(false)
  @Column(DataType.DATE)
  dataNascimento: Moment;

  @AllowNull(false)
  @Column(DataType.STRING)
  sexo: string;

  @ForeignKey(() => Usuario)
  @Column
  usuarioId: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}

export default Pessoa;
