import { useBoolean } from 'ahooks';
import { Col, Form, Input, message, Modal, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IProjectRuleTemplateResV1 } from '../../../../../api/common';
import ruleTemplate from '../../../../../api/rule_template';
import { ModalFormLayout, ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateRuleTemplateListModalStatus } from '../../../../../store/ruleTemplate';
import EventEmitter from '../../../../../utils/EventEmitter';
import { nameRule } from '../../../../../utils/FormRule';
import { useCurrentProjectName } from '../../../../ProjectManage/ProjectDetail';
import { CloneRuleTemplateFormFields } from './index.type';
import { Link } from '../../../../../components/Link';

const CloneRuleTemplateModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm<CloneRuleTemplateFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.ruleTemplate.modalStatus[ModalName.Clone_Rule_Template]
  );
  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();
  const { projectName } = useCurrentProjectName();

  const currentRuleTemplate = useSelector<
    IReduxState,
    IProjectRuleTemplateResV1 | null
  >((state) => state.ruleTemplate.selectRuleTemplate);

  const close = () => {
    form.resetFields();
    dispatch(
      updateRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: false,
      })
    );
  };

  const submit = async () => {
    const value = await form.validateFields();
    startRequest();
    ruleTemplate
      .cloneProjectRuleTemplateV1({
        rule_template_name: currentRuleTemplate?.rule_template_name ?? '',
        new_rule_template_name: value.templateName,
        desc: value.templateDesc,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('ruleTemplate.cloneRuleTemplate.successTips', {
              name: currentRuleTemplate?.rule_template_name,
            })
          );
          close();
          EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
        }
      })
      .finally(() => {
        requestFinished();
      });
  };

  return (
    <Modal
      open={visible}
      title={t('ruleTemplate.cloneRuleTemplate.title')}
      closable={false}
      onOk={submit}
      onCancel={close}
      okButtonProps={{ loading: requestPending }}
      cancelButtonProps={{ disabled: requestPending }}
    >
      <Space direction="vertical" className="full-width-element">
        <Row>
          <Col offset={2}>
            {t('ruleTemplate.cloneRuleTemplate.currentTemplateTips')}
            <Link
              target="_blank"
              to={`project/${projectName}/rule/template/update/${currentRuleTemplate?.rule_template_name}`}
            >
              {currentRuleTemplate?.rule_template_name}
            </Link>
          </Col>
          <Col offset={2}>
            <Typography.Text type="secondary">
              {t('ruleTemplate.cloneRuleTemplate.cloneDesc')}
            </Typography.Text>
          </Col>
        </Row>
        <Form form={form} {...ModalFormLayout}>
          <Form.Item
            label={t('ruleTemplate.ruleTemplateForm.templateName')}
            name="templateName"
            validateFirst={true}
            rules={[
              {
                required: true,
              },
              ...nameRule(),
            ]}
          >
            <Input
              placeholder={t('common.form.placeholder.input', {
                name: t('ruleTemplate.ruleTemplateForm.templateName'),
              })}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.ruleTemplateForm.templateDesc')}
            name="templateDesc"
          >
            <Input.TextArea
              className="textarea-no-resize"
              placeholder={t('common.form.placeholder.input', {
                name: t('ruleTemplate.ruleTemplateForm.templateDesc'),
              })}
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default CloneRuleTemplateModal;
