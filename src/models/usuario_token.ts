import Usuario from "@models/usuario";
import { Moment } from "moment";
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

@Table({
  indexes: [ { fields: ["token"] } ],
  tableName: "usuario_token"
})
class UsuarioToken extends Model<UsuarioToken> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  agente: string;

  @Default(true)
  @AllowNull(false)
  @Column
  ativo: boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  dataCadastro: Moment;

  @Column(DataType.DATE)
  dataVencimento: Moment;

  @AllowNull(false)
  @Column(DataType.STRING)
  ip: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  token: string;

  @ForeignKey(() => Usuario)
  @AllowNull(false)
  @Column
  usuarioId: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}

export default UsuarioToken;
