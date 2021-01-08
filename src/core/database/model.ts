import { Model } from "sequelize-typescript";

export type TPaginateOptions = {
  page?: number
  perPage?: number
  limit?: number,
  offset?: number,
  order?: Array<any>,
  where?: any
  attributes?: any
};

export type TPaginateResult = {
  paginacao: {
    pagina: number,
    registros: number,
    totalPaginas: number,
    totalRegistros: number,
    ordenacao: Array<any>
  },
  registros: Array<any>
};

export class SequelizeModel<T extends SequelizeModel<T>> extends Model<T> {
  static async paginate<T extends SequelizeModel<T>> (options?: TPaginateOptions): Promise<TPaginateResult> {
    options = options || { };
    options.page = options.page || 1;
    options.perPage = options.perPage || 10;
    options.order = options.order || [[ "id", "asc" ]];
    options.where = options.where || { };
    options.attributes = options.attributes || { };

    try {
      if (typeof options.page === "string") options.page = parseInt(options.page);
      if (typeof options.perPage === "string") options.perPage = parseInt(options.perPage);
    } catch (e) {
      throw new Error("Paginação inválida!");
    }

    options.limit = options.perPage;
    options.offset = (options.page - 1) * options.perPage;

    const result = await this.findAndCountAll(options);

    return {
      paginacao: {
        pagina: options.page,
        registros: options.perPage,
        totalPaginas: Math.ceil(result.count / options.perPage),
        totalRegistros: result.count,
        ordenacao: options.order[0]
      },
      registros: result.rows
    };
  }
}

export default SequelizeModel;
