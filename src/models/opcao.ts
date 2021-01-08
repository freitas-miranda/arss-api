import SequelizeModel from "@core/database/model";
import {
  AllowNull,
  Column,
  DataType,
  Table
} from "sequelize-typescript";

@Table({ tableName: "opcao" })
class Opcao extends SequelizeModel<Opcao> {

  @AllowNull(false)
  @Column(DataType.STRING)
  descricao: string;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  grupo: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  item: number;
}

export default Opcao;
