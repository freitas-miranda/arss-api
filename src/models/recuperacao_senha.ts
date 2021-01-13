import { Moment } from "moment";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum RecuperacaoSenhaAtivo {
  Nao = 0,
  Sim = 1
}

@Table({ tableName: "recuperacao_senha" })
class RecuperacaoSenha extends Model<RecuperacaoSenha> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  token: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  usuarioId: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  dataVencimento: Moment;

  @Column(DataType.INTEGER)
  ativo: number;
}

export default RecuperacaoSenha;
