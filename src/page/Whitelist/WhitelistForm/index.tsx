import { Form, Input, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import { ModalFormLayout } from '../../../data/common';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useStyles from '../../../theme';
import { WhitelistFormProps } from './index.type';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';
import { I18nKey } from '../../../types/common.type';

export const WhitelistMatchTypeLabel: {
  [key in CreateAuditWhitelistReqV1MatchTypeEnum]: I18nKey;
} = {
  [CreateAuditWhitelistReqV1MatchTypeEnum.fp_match]:
    'whitelist.matchType.fingerPrint',
  [CreateAuditWhitelistReqV1MatchTypeEnum.exact_match]:
    'whitelist.matchType.exact',
};

const WhitelistForm: React.FC<WhitelistFormProps> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { currentEditorTheme } = useChangeTheme();

  return (
    <Form form={props.form} {...ModalFormLayout}>
      <Form.Item
        label={t('whitelist.table.matchType')}
        name="matchType"
        initialValue={CreateAuditWhitelistReqV1MatchTypeEnum.exact_match}
      >
        <Radio.Group>
          <Radio value={CreateAuditWhitelistReqV1MatchTypeEnum.exact_match}>
            {t(
              WhitelistMatchTypeLabel[
                CreateAuditWhitelistReqV1MatchTypeEnum.exact_match
              ]
            )}
          </Radio>
          <Radio value={CreateAuditWhitelistReqV1MatchTypeEnum.fp_match}>
            {t(
              WhitelistMatchTypeLabel[
                CreateAuditWhitelistReqV1MatchTypeEnum.fp_match
              ]
            )}
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label={t('whitelist.table.desc')} name="desc">
        <Input.TextArea
          className="textarea-no-resize"
          autoSize={{
            minRows: 3,
            maxRows: 10,
          }}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>
      <Form.Item
        name="sql"
        label={t('order.sqlInfo.sql')}
        initialValue="/* input your sql */"
        wrapperCol={{
          ...ModalFormLayout.wrapperCol,
          className: styles.editor,
        }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <MonacoEditor
          theme={currentEditorTheme}
          width="100%"
          height="500"
          language="sql"
        />
      </Form.Item>
    </Form>
  );
};

export default WhitelistForm;
