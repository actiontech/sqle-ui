import { MDEditorProps } from '@uiw/react-md-editor';

export type RuleUnderstandProps = {
  ruleName: string;
  content?: string;
  refresh: () => void;
  dbType: string;
  loading: boolean;
  isAdmin: boolean;
  isCustomRule: boolean;
};

export type EditKnowledgeContentProps = {
  value: MDEditorProps['value'];
  onChange: MDEditorProps['onChange'];
  setHasDirtyData: (val: boolean) => void;
};
