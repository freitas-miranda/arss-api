import Pessoa from "@models/pessoa";
import Telefone from "@models/telefone";

import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({ tableName: "pessoa_telefone" })
class PessoaTelefone extends Model<PessoaTelefone> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Pessoa)
  @AllowNull(false)
  @Column
  pessoaId: number;

  @ForeignKey(() => Telefone)
  @AllowNull(false)
  @Column
  telefoneId: number;

  @BelongsTo(() => Pessoa)
  pessoa: Pessoa;

  @BelongsTo(() => Telefone)
  telefone: Telefone;
}

export default PessoaTelefone;
