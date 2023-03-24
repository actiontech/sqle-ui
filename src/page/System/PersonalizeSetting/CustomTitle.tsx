import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useBoolean, useKeyPress } from 'ahooks';
import { Col, Input, message, Row, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import configuration from '../../../api/configuration';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';

const CustomTitle: React.FC<{
  title: string;
  refresh: () => void;
}> = ({ title, refresh }) => {
  const { t } = useTranslation();
  const [editTitle, { setTrue: startEditTitle, setFalse: closeEditTitle }] =
    useBoolean(false);
  const inputRef = useRef<Input | null>(null);
  const [inputValue, setInputValue] = useState('');
  const updateTitle = async (event: KeyboardEvent) => {
    const value = (event.target as HTMLInputElement).value;
    if (value === title) {
      message.error(t('system.personalize.match'));
      return;
    }

    const res = await configuration.personalise({ title: value });
    if (res.data.code === ResponseCode.SUCCESS) {
      message.success(t('system.personalize.updateTitleSuccessTips'));
      refresh();
    }

    closeEditTitle();
  };

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useKeyPress('esc', closeEditTitle, {
    target: () => document.getElementById('titleInput'),
  });

  useKeyPress('enter', updateTitle, {
    target: () => document.getElementById('titleInput'),
  });

  useEffect(() => {
    if (editTitle) {
      inputRef.current?.focus();
    }
  }, [editTitle]);
  return (
    <Row align="middle">
      <Col sm={3} xl={2} xs={24}>
        <Typography.Text>{t('system.personalize.title')} : </Typography.Text>
      </Col>
      <Col sm={10} xs={24}>
        <div hidden={editTitle}>
          <Typography.Text>
            <EmptyBox if={!!title} defaultNode="--">
              {title}
            </EmptyBox>
            <Typography.Link onClick={startEditTitle}>
              <EditOutlined />
            </Typography.Link>
          </Typography.Text>
        </div>
        <div hidden={!editTitle}>
          <Input
            id="titleInput"
            ref={(ref) => (inputRef.current = ref)}
            suffix={<EnterOutlined />}
            value={inputValue}
            onChange={inputChange}
            onBlur={closeEditTitle}
            placeholder={t('common.form.placeholder.input', {
              name: t('system.personalize.title'),
            })}
          />
        </div>
      </Col>
    </Row>
  );
};

export default CustomTitle;
