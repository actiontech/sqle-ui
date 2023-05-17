import { useTranslation } from 'react-i18next';
import React from 'react';
import Copy from '../../utils/Copy';
import { Tooltip } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { CopyIconProps } from '.';
import './index.less';

const CopyIcon: React.FC<CopyIconProps> = ({
  text,
  children,
  tooltips = true,
  onCopy,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const copyIdRef = React.useRef<number>();

  const cleanCopyId = () => {
    window.clearTimeout(copyIdRef.current!);
  };

  React.useEffect(() => cleanCopyId, []);

  const onCopyClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    Copy.copyText(text || (children && String(children)) || '');

    setCopied(true);

    cleanCopyId();
    copyIdRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 3000);

    onCopy?.(e);
  };

  const tooltipsTitle = React.useMemo(() => {
    if (!tooltips) {
      return '';
    }
    if (tooltips === true) {
      return copied ? t('common.copied') : '';
    }

    return copied ? tooltips : '';
  }, [copied, t, tooltips]);

  return (
    <Tooltip key="copy" title={tooltipsTitle}>
      <div
        onClick={onCopyClick}
        className={`actiontech-copy ${copied ? `actiontech-copy-success` : ''}`}
      >
        {copied ? <CheckOutlined /> : <CopyOutlined />}
      </div>
    </Tooltip>
  );
};

export default CopyIcon;
