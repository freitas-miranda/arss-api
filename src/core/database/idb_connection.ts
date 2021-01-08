interface IDbConnection {
  alias: string;
  connection: any;
  options?: object;

  config (): void;
}

export default IDbConnection;
