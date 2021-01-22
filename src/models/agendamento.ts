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

@Table({ tableName: "agendamento" })
class Agendamento extends Model<Agendamento> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  pacienteId: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  medicoId: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  especialidadeId: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  status: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  dia: Moment;

  @AllowNull(false)
  @Column(DataType.STRING)
  hora: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  solicitacao: Moment;

  @Column(DataType.DATE)
  confirmacao: Moment;

  @Column(DataType.STRING)
  responsavel: string;

  @Column(DataType.DATE)
  inicio: Moment;

  @Column(DataType.DATE)
  fim: Moment;

  @Column(DataType.STRING)
  observacao: string;

}

export default Agendamento;
