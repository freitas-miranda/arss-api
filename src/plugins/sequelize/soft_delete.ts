import Bluebird from "bluebird";
import { assign, defaults, extend, get, head } from "lodash";
import { literal, DestroyOptions, InstanceDestroyOptions, QueryTypes, Utils } from "sequelize";
import { Model, Sequelize } from "sequelize-typescript";

const Errors = require("sequelize/lib/errors");

type SoftDeleteOptions = {
  deleted?: string | { field?: string, defaultValue?: any, deletedValue?: any }
  deletedAt?: string,
  deletedBy?: string | { field?: string, defaultValue?: Function }
};

export default function (sequelize: Sequelize, softDeleteOptions?: SoftDeleteOptions) {
  if ((!softDeleteOptions.deleted) && (!softDeleteOptions.deletedAt)) {
    softDeleteOptions.deleted = { field: "deleted", defaultValue: false, deletedValue: true };
  }

  if (softDeleteOptions.deleted) {
    if (typeof softDeleteOptions.deleted === "string") {
      softDeleteOptions.deleted = { field: softDeleteOptions.deleted, defaultValue: false, deletedValue: true };
    } else {
      softDeleteOptions.deleted = Object.assign({
        field: softDeleteOptions.deleted,
        defaultValue: false,
        deletedValue: true
      }, softDeleteOptions.deleted);
    }
  }

  if (softDeleteOptions.deletedBy) {
    if (typeof softDeleteOptions.deletedBy === "string") {
      softDeleteOptions.deletedBy = { field: softDeleteOptions.deletedBy };
    } else {
      softDeleteOptions.deletedBy = Object.assign({
        field: "deleted_by",
      }, softDeleteOptions.deletedBy);
    }
  }

  if (!softDeleteOptions.deletedAt) softDeleteOptions.deletedAt = "deleted_at";

  sequelize.addHook("beforeCreate", "sequelize-sof-delete-beforeCreate", function (instance: any, options: any) {
    if (softDeleteOptions.deleted) {
      options.fields.push((<any>softDeleteOptions.deleted).field);
      instance.setDataValue((<any>softDeleteOptions.deleted).field, (<any>softDeleteOptions.deleted).defaultValue);
    }
  });

  function paranoidClause (_model: any, options: any): any {
    options = options || {};

    if (options.include) {
      for (const include of options.include) {
        this._paranoidClause(include.model, include);
      }
    }

    if (get(options, "groupedLimit.on.options.paranoid")) {
      const throughModel = get(options, "groupedLimit.on.through.model");
      if (throughModel) {
        options.groupedLimit.through = this._paranoidClause(throughModel, options.groupedLimit.through);
      }
    }

    options.where = whereNotDeleted(options.where);

    return options;
  }

  function forceDelete (instance: any, constructor: any, options?: DestroyOptions): any {
    return constructor.QueryInterface.delete(
      instance, constructor.getTableName(options), options.where, assign({
        type: QueryTypes.DELETE, limit: undefined
      }, options)
    );
  }

  function softDelete (instance: any, constructor: any, options?: DestroyOptions): any {
    const value: any = { };

    if (softDeleteOptions.deleted) {
      value[(<any>softDeleteOptions.deleted).field] = (<any>softDeleteOptions.deleted).deletedValue;
    }

    value[softDeleteOptions.deletedAt] = literal("NOW()");

    if (softDeleteOptions.deletedBy) {
      value[(<any>softDeleteOptions.deletedBy).field] = (<any>softDeleteOptions.deletedBy).defaultValue();
    }

    return constructor.QueryInterface.update(
      instance, constructor.getTableName(options), value, options.where, defaults({
        hooks: false,
        model: constructor
      }, options)
    ).then((results: any) => {
      const where = options.where;
      const rowsUpdated = results[1];
      if (constructor._versionAttribute && rowsUpdated < 1) {
        throw new Errors.OptimisticLockError({
          modelName: constructor.name,
          value,
          where
        });
      }
      return head(results);
    });
  }

  function whereNotDeleted (where: any): any {
    where = where || { };

    if (softDeleteOptions.deleted) {
      where[(<any>softDeleteOptions.deleted).field] = (<any>softDeleteOptions.deleted).defaultValue;
    } else {
      where[(<any>softDeleteOptions.deletedAt).field] = undefined;
    }

    return where;
  }

  (<any>Model)._paranoidClause = paranoidClause;

  (<any>Model).prototype.destroy = function destroy (options?: InstanceDestroyOptions): Bluebird<void> {
    const constructor = Object.getPrototypeOf(this).constructor;

    options = extend({
      hooks: true,
      force: false
    }, options);

    return Bluebird.try(() => {
      if ((<any>options).hooks) {
        return constructor.runHooks("beforeDestroy", this, options);
      }
    }).then(() => {
      (<any>options).where = whereNotDeleted(this.where(true));

      if (options.force) return forceDelete(this, constructor, options);
      else return softDelete(this, constructor, options);
    });
  };

  (<any>Model).destroy = function destroy (options?: DestroyOptions): any {
    options = Utils.cloneDeep(options);

    this._injectScope(options);

    if (!options || !(options.where || options.truncate)) {
      throw new Error("Missing where or truncate attribute in the options parameter of model.destroy.");
    }

    options = defaults(options, {
      transaction: this.transaction,
      hooks: true,
      individualHooks: false,
      force: false,
      cascade: false,
      restartIdentity: false
    });

    (<any>options).type = QueryTypes.BULKDELETE;

    Utils.mapOptionFieldNames(options, this);
    (<any>options).model = this;

    let instances: any;

    return Bluebird.try(() => {
      // Run before hook
      if (options.hooks) {
        return this.runHooks("beforeBulkDestroy", options);
      }
    }).then(() => {
      // Get daos and run beforeDestroy hook on each record individually
      if (options.individualHooks) {
        return this.findAll({where: options.where, transaction: options.transaction, logging: options.logging, benchmark: options.benchmark})
          .map((instance: any) => this.runHooks("beforeDestroy", instance, options).then(() => instance))
          .then((_instances: any) => {
            instances = _instances;
          });
      }
    }).then(() => {
      if (options.force) {
        return this.QueryInterface.bulkDelete(this.getTableName(options), options.where, options, this);
      } else {
        options.where = whereNotDeleted(options.where);
        (<any>options).type = QueryTypes.BULKUPDATE;

        const value: any = { };

        if (softDeleteOptions.deleted) {
          value[(<any>softDeleteOptions.deleted).field] = (<any>softDeleteOptions.deleted).deletedValue;
        }

        value[softDeleteOptions.deletedAt] = literal("NOW()");

        if (softDeleteOptions.deletedBy) {
          value[(<any>softDeleteOptions.deletedBy).field] = (<any>softDeleteOptions.deletedBy).defaultValue();
        }

        return this.QueryInterface.bulkUpdate(this.getTableName(options), value, options.where, options, this.rawAttributes);
      }
    }).tap(() => {
      // Run afterDestroy hook on each record individually
      if (options.individualHooks) {
        return Bluebird.map(instances, (instance: any) => this.runHooks("afterDestroy", instance, options));
      }
    }).tap(() => {
      // Run after hook
      if (options.hooks) {
        return this.runHooks("afterBulkDestroy", options);
      }
    });
  };
}
