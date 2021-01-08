import { literal, Sequelize } from "sequelize";

interface TimestampOptions {
  createdAt?: string;
  createdBy?: { field?: string,  defaultValue: Function };
  updatedAt?: string;
  updatedBy?: { field?: string,  defaultValue: Function };
}

export default function (sequelize: Sequelize, timestamp?: TimestampOptions) {
  timestamp = timestamp || { };

  if (!timestamp.createdAt) timestamp.createdAt = "created_at";
  if (!timestamp.updatedAt) timestamp.updatedAt = "updated_at";

  if (timestamp.createdBy) {
    timestamp.createdBy = Object.assign({field: "created_by"}, timestamp.createdBy);
  }

  if (timestamp.updatedBy) {
    timestamp.updatedBy = Object.assign({field: "updated_by"}, timestamp.updatedBy);
  }

  sequelize.addHook("beforeCreate", "sequelize-timestamp-beforeCreate", function (instance: any, options: any) {
    options.fields.push(timestamp.createdAt);
    instance.setDataValue(timestamp.createdAt, literal("NOW()"));

    if (timestamp.createdBy) {
      options.fields.push((<any>timestamp.createdBy).field);
      instance.setDataValue((<any>timestamp.createdBy).field, ((<any>global).login).defaultValue());
    }
  });

  sequelize.addHook("beforeUpdate", "sequelize-timestamp-beforeUpdate", function (instance: any, options: any) {
    options.fields.push(timestamp.updatedAt);
    instance.setDataValue(timestamp.updatedAt, literal("NOW()"));

    if (timestamp.updatedBy) {
      options.fields.push((<any>timestamp.updatedBy).field);
      instance.setDataValue((<any>timestamp.updatedBy).field, ((<any>global).login).defaultValue());
    }
  });

  sequelize.addHook("beforeBulkUpdate", "sequelize-timestamp-beforeUpdate", function (options: any) {
    options.fields.push(timestamp.updatedAt);
    options.attributes[timestamp.updatedAt] = literal("NOW()");

    if (timestamp.updatedBy) {
      options.fields.push((<any>timestamp.updatedBy).field);
      options.attributes[(<any>timestamp.updatedBy).field] = (<any>timestamp.updatedBy).defaultValue();
    }
  });
}
