import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';

class Write {
  public pathSeparator = path.sep;

  public writeFile(src: string, content: string) {
    this.makeDir(path.dirname(src));
    const file = prettier.format(content, {
      parser: 'typescript',
      tabWidth: 2,
      semi: true,
      printWidth: 80,
      trailingComma: 'none',
      arrowParens: 'avoid',
      proseWrap: 'preserve',
      useTabs: false,
      singleQuote: true,
      bracketSpacing: true,
      jsxBracketSameLine: false
    });
    fs.writeFile(src, file, err => {
      if (err) {
        console.log('Write: writeFile:' + src);
        console.error(err);
      }
    });
  }

  private makeDir(url: string) {
    const urlArray = url.split(this.pathSeparator);
    let hasDir = 0;
    for (let i = urlArray.length; i > 0; i--) {
      const currentUrl = urlArray.slice(0, i);
      const has = fs.existsSync(currentUrl.join(this.pathSeparator));
      if (has) {
        hasDir = i + 1;
        break;
      }
    }
    for (let i = hasDir; i <= urlArray.length; i++) {
      fs.mkdirSync(urlArray.slice(0, i).join(this.pathSeparator));
    }
  }
}

export default new Write();
