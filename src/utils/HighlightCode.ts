import hljs from 'highlight.js';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/github.css';

class HighlightCode {
  constructor() {
    hljs.registerLanguage('sql', sql);
  }

  public highlightSql(sql: string) {
    const code = hljs.highlight(sql, { language: 'sql' });
    return code.value;
  }
}

export default new HighlightCode();
