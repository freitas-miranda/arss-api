import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum grupo {
  simNao = 1,
  sexo = 2,
  tipoSanguineo = 3,
  tipoTelefone = 4,
  tipoAgendamento = 5,
  statusAgendamento = 6
}

@Table({ tableName: "opcao_item" })
class OpcaoItem extends Model<OpcaoItem> {

  @PrimaryKey
  @Column
  opcaoId: number;

  @PrimaryKey
  @Column(DataType.STRING)
  codigo: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  descricao: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ordem: number;
}

export default OpcaoItem;
