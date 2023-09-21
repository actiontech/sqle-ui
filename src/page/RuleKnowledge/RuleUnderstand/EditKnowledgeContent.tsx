import MDEditor from '@uiw/react-md-editor';
import { EditKnowledgeContentProps } from './index.type';
import rehypeSanitize from 'rehype-sanitize';

const EditKnowledgeContent: React.FC<EditKnowledgeContentProps> = ({
  value,
  onChange,
  setHasDirtyData,
}) => {
  return (
    <MDEditor
      height={500}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      value={value}
      onChange={(v) => {
        onChange?.(v);
        setHasDirtyData(true);
      }}
    />
  );
};

export default EditKnowledgeContent;
