module.exports = {
  swaggerJson(swaggerJsonStr) {
    const swaggerJson = JSON.parse(swaggerJsonStr);
    this.removeDot(swaggerJson);
    Object.keys(swaggerJson.definitions).forEach((key) => {
      const newKey = key.split('.')[1];
      swaggerJson.definitions[newKey] = swaggerJson.definitions[key];
      delete swaggerJson.definitions[key];
    });
    return swaggerJson;
  },
  removeDot(swaggerJson) {
    Object.keys(swaggerJson).forEach((key) => {
      if (
        key === 'in' &&
        swaggerJson[key] === 'body' &&
        swaggerJson.name !== 'body'
      ) {
        swaggerJson.name = 'body';
      }
      if (typeof swaggerJson[key] === 'object') {
        this.removeDot(swaggerJson[key]);
      } else if (key === '$ref') {
        const newName = swaggerJson[key].split('.')[1];
        swaggerJson[key] = `#/definitions/${newName}`;
      }
    });
  },
};
