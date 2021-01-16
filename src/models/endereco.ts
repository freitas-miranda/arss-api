import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({ tableName: "endereco" })
class Endereco extends Model<Endereco> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  logradouro: string;

  @Column(DataType.STRING)
  numero: string;

  @Column(DataType.STRING)
  bairro: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  cep: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  cidade: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  uf: string;
}

export default Endereco;
