import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

export const enum UsuarioAtivo {
  Nao = 0,
  Sim = 1
}

@Table({ tableName: "usuario" })
class Usuario extends Model<Usuario> {

  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nome: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  senha: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ativo: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  perfilAcessoId: number;

}

export default Usuario;
