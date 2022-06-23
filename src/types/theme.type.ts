export type Theme = {
  common: {
    padding: number;
    color: {
      warning: string;
      disabledFont: string;
    };
  };
  header: {
    background: string;
    color: string;
  };
  editor: {
    border: string;
  };
};
