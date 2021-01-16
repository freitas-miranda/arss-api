import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum TelefoneTipo {
  Pessoal = 1,
  Trabalho = 2,
  Parente = 3
}

@Table({ tableName: "telefone" })
class Telefone extends Model<Telefone> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  ddd: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  numero: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  tipo: number;
}

export default Telefone;
