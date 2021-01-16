import Email from "@models/email";
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

@Table({ tableName: "pessoa_email" })
class PessoaEmail extends Model<PessoaEmail> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Pessoa)
  @AllowNull(false)
  @Column
  pessoaId: number;

  @ForeignKey(() => Email)
  @AllowNull(false)
  @Column
  emailId: number;

}

export default PessoaEmail;
