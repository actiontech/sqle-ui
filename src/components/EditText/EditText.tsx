import { Typography } from 'antd';
import { useRef } from 'react';
import { EditTextProps } from '.';

const EditText: React.FC<EditTextProps> = (props) => {
  const { editable, ...otherProps } = props;

  const val = useRef<string>(
    typeof props.children === 'string' ? props.children : ''
  );

  return (
    <Typography.Paragraph
      {...otherProps}
      editable={{
        ...editable,
        onChange: (value) => {
          val.current = value;
          editable?.onChange?.(value);
        },
        onEnd: () => {
          editable?.onEnd?.(val.current);
        },
      }}
    />
  );
};

export default EditText;
