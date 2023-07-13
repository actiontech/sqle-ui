import { monaco } from 'react-monaco-editor';

export const regexMonarch: monaco.languages.IMonarchLanguage = {
  ignoreCase: false,

  tokenizer: {
    root: [
      [
        /\/(?=(?:\\.|[^\\/\\\n\r])+?\/[gimuy]{0,5}(?=\W|$))(?:\\.|[^\\/\\\n\r])+?\/[gimuy]{0,5}/,
        'regexp',
      ], // match regular expression literals
      [/\$[\w$]+/, 'variable'], // match variables
      [/\b[A-Z]\w*\b/, 'type'], // match types
      [/\b(?:\d+\.?\d*|\.\d+)\b/, 'number'], // match numbers
      [/[{}[\]()?,.:;]/, 'delimiter'], // match delimiters
      [/'(?:\\.|[^'\\\n\r])*'/, 'string'], // match single-quoted strings
      [/"(?:\\.|[^"\\\n\r])*"/, 'string'], // match double-quoted strings
      [/\b(?:try\s*\{)/, { token: 'keyword', next: '@catch' }], // match try-catch blocks
    ],
    catch: [
      [/.*?\}/, { token: 'keyword', next: '@pop' }], // match catch block
      [/./, 'comment'], // match everything else as a comment
    ],
  },
  defaultToken: 'invalid',
};

export const regexLanguage: monaco.languages.ILanguageExtensionPoint = {
  id: 'regexp',
  aliases: ['Regexp', 'regexp'],
  mimetypes: ['text/regexp'],
};
