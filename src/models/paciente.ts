import Pessoa from "@models/pessoa";

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

@Table({ tableName: "paciente" })
class Paciente extends Model<Paciente> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Pessoa)
  @AllowNull(false)
  @Column
  pessoaId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  cartaoSus: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  tipoSanguineo: string;

  @Column(DataType.FLOAT)
  peso: number;

  @Column(DataType.FLOAT)
  altura: number;
}

export default Paciente;
