export type FormItem = {
  desc?: string;
  key?: string;
  type?: 'string' | 'int' | 'bool';
  value?: string;
};

export type BackendFormProps = {
  params: FormItem[];
  paramsKey?: string;
};

export { default } from './BackendForm';
