import Endereco from "@models/endereco";
import Pessoa from "@models/pessoa";

import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({ tableName: "pessoa_endereco" })
class PessoaEndereco extends Model<PessoaEndereco> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Pessoa)
  @AllowNull(false)
  @Column
  pessoaId: number;

  @ForeignKey(() => Endereco)
  @AllowNull(false)
  @Column
  enderecoId: number;

}

export default PessoaEndereco;
