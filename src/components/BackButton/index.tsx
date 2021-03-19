import { Button, ButtonProps } from 'antd';
import { useTranslation } from 'react-i18next';
import useBack from '../../hooks/useBack';

const BackButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation();

  const { goBack } = useBack();

  return (
    <Button onClick={goBack} key="goBack" type="primary" {...props}>
      {t('common.back')}
    </Button>
  );
};

export default BackButton;
