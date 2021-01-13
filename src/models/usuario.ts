import SequelizeModel from "@core/database/model";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum UsuarioAtivo {
  Nao = 0,
  Sim = 1
}

@Table({ tableName: "usuario" })
class Usuario extends SequelizeModel<Usuario> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  ativo: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.STRING)
  senha: string;

}

export default Usuario;
