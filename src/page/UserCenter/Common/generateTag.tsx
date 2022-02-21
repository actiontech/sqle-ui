import { Tag } from 'antd';

export default function generateTag(list: string[]) {
  return list?.map((r) => <Tag key={r}>{r}</Tag>);
}
