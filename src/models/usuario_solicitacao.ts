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

@Table({ tableName: "usuario_solicitacao" })
class UsuarioSolicitacao extends Model<UsuarioSolicitacao> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  token: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  nome: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.DATE)
  dataConfirmacao: Moment;

  @Column
  dadosConfirmacao: string;

  @Column(DataType.INTEGER)
  usuarioId: number;
}

export default UsuarioSolicitacao;
