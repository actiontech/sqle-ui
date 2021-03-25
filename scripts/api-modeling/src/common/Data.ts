
class CommonData {

  public RequestMethod = ['get','post','head','put','delete','connect','options','trace', 'patch'];

  public parametersType = {
    'formData': 'formData',
    'body': 'body',
    'header': 'header',
    'query': 'query',
    'path': 'path'
  };

  public transformImportKey (key: string) {
    switch (key) {
      case 'd':
        return './index.d';
      case 'enum':
        return './index.enum';
      case 'common.d':
        return '../common.d';
      case 'common.enum':
        return '../common.enum';
      default:
        throw new Error('CommonData: transformImportKey: invalid import key');
    }
  }

  public upperCaseFirstLetter (name: string) {
    return `${name[0].toUpperCase()}${name.slice(1)}`
  }

  public removeSpecialStr (str: string): string {
    const tempArray = str.split('');
    let result = '';
    for(let i = 0; i < tempArray.length; i++) {
      if (!/^[a-zA-Z1-9]{1}$/.test(tempArray[i]) && i < tempArray.length - 1) {
        tempArray[i+1] = tempArray[i+1].toUpperCase();
      } else {
        result += tempArray[i];
      }
    }
    return result;
  }

}

export default new CommonData();
