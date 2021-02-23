import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum PerfilAcesso {
  Admin = 1,
  Gestor = 2,
  Atendente = 3,
  Paciente = 4
}

@Table({ tableName: "perfil_acesso" })
class Perfil extends Model<Perfil> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  descricao: string;
}

export default Perfil;
