const mockEditor = (props) => {
  // https://github.com/react-monaco-editor/react-monaco-editor/issues/176
  const { editorDidMount, ...otherProps } = props;
  return <input {...otherProps} />;
};

export default mockEditor;
