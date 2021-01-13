class Helper {

  protected camelToSnake (params: any) {
    const snake = params.replace(/[\w]([A-Z])/g, (m: any) => {
      return m[0] + "_" + m[1];
    }).toLowerCase();

    return snake;
  }
  protected inArray (value: any, array: any) {
    return (array.indexOf(value) === -1) ? false : true;
  }
}

export default Helper;
