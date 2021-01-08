import moment from "moment";
import { DATE } from "sequelize";

export default function (format: string) {
  DATE.prototype._stringify = function _stringify (date: any) {
    return moment(date).format(format);
  };

  DATE.prototype._sanitize = function _sanitize (value: any) {
    if ((!!value) && (!(value instanceof moment))) {
      return moment(value, format);
    }
    return value;
  };
}
