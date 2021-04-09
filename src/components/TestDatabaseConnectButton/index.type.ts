export type TestDatabaseConnectButtonProps = {
  initHide?: boolean;
  onClickTestButton: () => void;
  loading: boolean;
  connectAble: boolean;
  connectDisableReason?: string;
};
