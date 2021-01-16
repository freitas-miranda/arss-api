import Pessoa from "@models/pessoa";

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

  @Column(DataType.STRING)
  cartaoSus: string;

  @Column(DataType.STRING)
  tipoSanguineo: string;

  @Column(DataType.FLOAT)
  peso: number;

  @Column(DataType.FLOAT)
  altura: number;

  @BelongsTo(() => Pessoa)
  pessoa: Pessoa;
}

export default Paciente;
