import { EditOutlined, EnterOutlined } from '@ant-design/icons';
import { useBoolean, useKeyPress } from 'ahooks';
import { Col, Typography, Input, Row, message } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import { WechatProps } from '.';
import user from '../../../api/user';
import { ResponseCode } from '../../../data/common';

const Wechat: React.FC<WechatProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<Input | null>(null);
  const [editWechat, { setTrue: startEditWechat, setFalse: closeEditWechat }] =
    useBoolean(false);

  const [inputValue, setInputValue] = React.useState(props.userInfo?.wechat_id);

  const updateWechat = async (event: KeyboardEvent) => {
    const wechatId = (event.target as HTMLInputElement).value;
    const res = await user.updateCurrentUserV1({
      wechat_id: wechatId,
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      message.success(t('account.updateWechatSuccess'));
      props.refreshUserInfo();
    }
    closeEditWechat();
  };

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useKeyPress('esc', closeEditWechat, {
    target: () => document.getElementById('wechatInput'),
  });

  useKeyPress('enter', updateWechat, {
    target: () => document.getElementById('wechatInput'),
  });
  React.useEffect(() => {
    if (editWechat) {
      inputRef.current?.focus();
    }
  }, [editWechat]);

  return (
    <Row>
      <Col sm={3} xs={24}>
        <Typography.Title level={5}>
          {t('user.userForm.wechat')}
        </Typography.Title>
      </Col>
      <Col sm={10} xs={24}>
        <div hidden={editWechat}>
          <Typography.Text>
            <EmptyBox if={!!props.userInfo?.wechat_id} defaultNode="--">
              {props.userInfo?.wechat_id}
            </EmptyBox>
            <Typography.Link onClick={startEditWechat}>
              <EditOutlined />
            </Typography.Link>
          </Typography.Text>
        </div>
        <div hidden={!editWechat}>
          <Input
            id="wechatInput"
            ref={(ref) => (inputRef.current = ref)}
            suffix={<EnterOutlined />}
            value={inputValue}
            onChange={inputChange}
            onBlur={closeEditWechat}
            placeholder={t('common.form.placeholder.input')}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Wechat;
