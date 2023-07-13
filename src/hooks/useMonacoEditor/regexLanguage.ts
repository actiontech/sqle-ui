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
    ],
  },
  defaultToken: 'invalid',
};

export const regexLanguage: monaco.languages.ILanguageExtensionPoint = {
  id: 'regexp',
  aliases: ['Regexp', 'regexp'],
  mimetypes: ['text/regexp'],
};
