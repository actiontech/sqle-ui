import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTheme } from '@material-ui/styles';
import { useBoolean } from 'ahooks';
import {
  Alert,
  Col,
  Input,
  Row,
  Space,
  Steps,
  Typography,
  Select,
  Button,
  Tooltip,
} from 'antd';
import { cloneDeep } from 'lodash';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkFlowStepTemplateReqV1 } from '../../../../api/common';
import { WorkFlowStepTemplateReqV1TypeEnum } from '../../../../api/common.enum';
import EmptyBox from '../../../../components/EmptyBox';
import EmitterKey from '../../../../data/EmitterKey';
import useUsername from '../../../../hooks/useUsername';
import { Theme } from '../../../../types/theme.type';
import EventEmitter from '../../../../utils/EventEmitter';
import { ProgressConfigItem, ProgressConfigProps } from './index.type';

const ProgressConfig: React.FC<ProgressConfigProps> = (props) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const [progressData, setProgressData] = useState<ProgressConfigItem[]>([]);
  const [execProgressData, setExecProgressData] = useState<ProgressConfigItem>({
    assignee_user_name_list: [],
    desc: '',
  });
  const [
    execProgressError,
    { setTrue: setExecProgressErrorTrue, setFalse: setExecProgressErrorFalse },
  ] = useBoolean(false);
  const [progressError, setProgressError] = useState<number[]>([]);

  const updateUsername = (index: number, value: string[]) => {
    const temp = cloneDeep(progressData);
    temp[index].assignee_user_name_list = value;
    if (progressError.includes(index) && value.length > 0) {
      setProgressError(progressError.filter((e) => e !== index));
    }
    setProgressData(temp);
  };

  const updateExecUsername = (value: string[]) => {
    setExecProgressData({
      ...execProgressData,
      assignee_user_name_list: value,
    });
    if (value.length > 0 && execProgressError) {
      setExecProgressErrorFalse();
    }
  };

  const updateDesc = (
    index: number,
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const temp = cloneDeep(progressData);
    temp[index].desc = event.target.value;
    setProgressData(temp);
  };

  const updateExecDesc = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setExecProgressData({
      ...execProgressData,
      desc: event.target.value,
    });
  };

  const addProgressItem = () => {
    const temp = cloneDeep(progressData);
    temp.push({
      assignee_user_name_list: [],
      desc: '',
    });
    setProgressData(temp);
  };

  const deleteProgressItem = (index: number) => {
    const temp = cloneDeep(progressData);
    temp.splice(index, 1);
    if (progressError.includes(index)) {
      setProgressError(progressError.filter((e) => e !== index));
    }
    setProgressData(temp);
  };

  const upMoveProgressItem = (index: number) => {
    const temp = cloneDeep(progressData);
    const removeItem = temp.splice(index, 1)[0];
    temp.splice(index - 1, 0, removeItem);
    if (progressError.includes(index)) {
      const temp = progressError.filter((e) => e !== index);
      temp.push(index - 1);
      setProgressError(temp);
    }
    setProgressData(temp);
  };

  const downMoveProgressItem = (index: number) => {
    const temp = cloneDeep(progressData);
    const removeItem = temp.splice(index, 1)[0];
    temp.splice(index + 1, 0, removeItem);
    if (progressError.includes(index)) {
      const temp = progressError.filter((e) => e !== index);
      temp.push(index + 1);
      setProgressError(temp);
    }
    setProgressData(temp);
  };

  const validateProgress = (): boolean => {
    const tempError: number[] = [];
    for (let i = 0; i < progressData.length; i++) {
      const len = progressData[i].assignee_user_name_list.length;
      if (len <= 0 || len > 3) {
        tempError.push(i);
      }
    }
    setProgressError(tempError);
    const len = execProgressData.assignee_user_name_list.length;
    if (len === 0 || len > 3) {
      setExecProgressErrorTrue();
    } else {
      setExecProgressErrorFalse();
    }
    return tempError.length === 0 && len > 0 && len <= 3;
  };

  const resetProgress = React.useCallback(() => {
    setProgressData([]);
    setExecProgressData({
      assignee_user_name_list: [],
      desc: '',
    });
    setExecProgressErrorFalse();
    setProgressError([]);
  }, [setExecProgressErrorFalse]);

  const submit = () => {
    if (!validateProgress()) {
      return;
    }
    const progressConfig: IWorkFlowStepTemplateReqV1[] = [];
    progressData.forEach((item) => {
      progressConfig.push({
        ...item,
        type: WorkFlowStepTemplateReqV1TypeEnum.sql_review,
      });
    });
    progressConfig.push({
      ...execProgressData,
      type: WorkFlowStepTemplateReqV1TypeEnum.sql_execute,
    });
    props.submitProgressConfig(progressConfig);
  };

  const { updateUsernameList, generateUsernameSelectOption } = useUsername();

  React.useEffect(() => {
    updateUsernameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const resetAllForm = () => {
      resetProgress();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Workflow_Template_Form,
      resetAllForm
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Workflow_Template_Form,
        resetAllForm
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetProgress]);

  React.useEffect(() => {
    if (!!props.defaultData) {
      const templateList = props.defaultData.workflow_step_template_list ?? [];
      if (templateList.length <= 1) {
        setExecProgressData({
          assignee_user_name_list:
            templateList?.[0].assignee_user_name_list ?? [],
          desc: templateList?.[0].desc ?? '',
        });
        return;
      }
      const execStep = templateList.pop();
      setProgressData(
        props.defaultData.workflow_step_template_list?.map((e) => ({
          assignee_user_name_list: e.assignee_user_name_list ?? [],
          desc: e.desc ?? '',
        })) ?? []
      );
      setExecProgressData({
        assignee_user_name_list: execStep?.assignee_user_name_list ?? [],
        desc: execStep?.desc ?? '',
      });
    }
  }, [props.defaultData]);

  return (
    <Space direction="vertical" className="full-width-element" size={24}>
      <Row>
        <Col span={8} offset={4}>
          <Steps direction="vertical">
            <Steps.Step
              status="process"
              title={t('workflowTemplate.progressConfig.createStep.title')}
              description={t('workflowTemplate.progressConfig.createStep.desc')}
            />
            {progressData.map((progressItem, index) => (
              <Steps.Step
                key={index}
                status={progressError.includes(index) ? 'error' : 'process'}
                title={t('workflowTemplate.progressConfig.review.title')}
                subTitle={t('workflowTemplate.progressConfig.review.subTitle')}
                description={
                  <Row>
                    <Col span={18}>
                      <Space
                        size={theme.common.padding}
                        direction="vertical"
                        className="full-width-element"
                      >
                        <Row>
                          <Col span={5}>
                            {t('workflowTemplate.form.label.reviewUser')}
                          </Col>
                          <Col span={18}>
                            <Select
                              value={progressItem.assignee_user_name_list}
                              onChange={updateUsername.bind(null, index)}
                              className="full-width-element"
                              mode="multiple"
                              placeholder={t('common.form.placeholder.select')}
                            >
                              {generateUsernameSelectOption()}
                            </Select>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={5} className="text-black">
                            {t('workflowTemplate.form.label.reviewDesc')}
                          </Col>
                          <Col span={18}>
                            <Input.TextArea
                              value={progressItem.desc}
                              onChange={updateDesc.bind(null, index)}
                              className="textarea-no-resize"
                              placeholder={t('common.form.placeholder.input')}
                            />
                          </Col>
                        </Row>
                        <EmptyBox if={progressError.includes(index)}>
                          <Alert
                            type="error"
                            message={t(
                              'workflowTemplate.progressConfig.ruler.rule5'
                            )}
                          />
                        </EmptyBox>
                      </Space>
                    </Col>
                    <Col span={6}>
                      <div hidden={index === 0}>
                        <Button
                          type="link"
                          onClick={upMoveProgressItem.bind(null, index)}
                        >
                          <Tooltip
                            overlay={t(
                              'workflowTemplate.progressConfig.operator.moveUp'
                            )}
                          >
                            <UpOutlined />
                          </Tooltip>
                        </Button>
                      </div>
                      <div hidden={index === progressData.length - 1}>
                        <Button
                          type="link"
                          onClick={downMoveProgressItem.bind(null, index)}
                        >
                          <Tooltip
                            overlay={t(
                              'workflowTemplate.progressConfig.operator.moveDown'
                            )}
                          >
                            <DownOutlined />
                          </Tooltip>
                        </Button>
                      </div>
                      <Button
                        type="link"
                        danger
                        onClick={deleteProgressItem.bind(null, index)}
                      >
                        {t('workflowTemplate.progressConfig.operator.remove')}
                      </Button>
                    </Col>
                  </Row>
                }
              />
            ))}
            <Steps.Step
              title={t('workflowTemplate.progressConfig.exec.title')}
              status={execProgressError ? 'error' : 'process'}
              subTitle={t('workflowTemplate.progressConfig.exec.subTitle')}
              description={
                <Row>
                  <Col span={18}>
                    <Space
                      size={theme.common.padding}
                      direction="vertical"
                      className="full-width-element"
                    >
                      <Row>
                        <Col span={5}>
                          {t('workflowTemplate.form.label.execUser')}
                        </Col>
                        <Col span={18}>
                          <Select
                            onChange={updateExecUsername}
                            value={execProgressData.assignee_user_name_list}
                            className="full-width-element"
                            mode="multiple"
                            placeholder={t('common.form.placeholder.select')}
                          >
                            {generateUsernameSelectOption()}
                          </Select>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={5} className="text-black">
                          {t('workflowTemplate.form.label.reviewDesc')}
                        </Col>
                        <Col span={18}>
                          <Input.TextArea
                            value={execProgressData.desc}
                            onChange={updateExecDesc}
                            className="textarea-no-resize"
                            placeholder={t('common.form.placeholder.input')}
                          />
                        </Col>
                      </Row>
                      <EmptyBox if={execProgressError}>
                        <Alert
                          type="error"
                          message={t(
                            'workflowTemplate.progressConfig.ruler.rule5'
                          )}
                        />
                      </EmptyBox>
                    </Space>
                  </Col>
                </Row>
              }
            />
          </Steps>
        </Col>
        <Col span={7}>
          <Space direction="vertical" size={theme.common.padding}>
            <Alert
              type="warning"
              message={
                <Typography className="clear-margin-bottom">
                  <Typography.Title level={5}>
                    {t('workflowTemplate.progressConfig.ruler.title')}
                  </Typography.Title>
                  <ul className="clear-margin-bottom">
                    <li>{t('workflowTemplate.progressConfig.ruler.rule1')}</li>
                    <li>{t('workflowTemplate.progressConfig.ruler.rule2')}</li>
                    <li>{t('workflowTemplate.progressConfig.ruler.rule3')}</li>
                    <li>{t('workflowTemplate.progressConfig.ruler.rule4')}</li>
                    <li>{t('workflowTemplate.progressConfig.ruler.rule5')}</li>
                  </ul>
                </Typography>
              }
            />
            <Button
              type="primary"
              onClick={addProgressItem}
              disabled={progressData.length >= 4}
            >
              {t('workflowTemplate.progressConfig.operator.addReview')}
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col offset={12}>
          <Space>
            <Button disabled={props.submitLoading} onClick={props.prevStep}>
              {t('common.prevStep')}
            </Button>
            <Button onClick={resetProgress} disabled={props.submitLoading}>
              {t('common.reset')}
            </Button>
            <Button
              type="primary"
              onClick={submit}
              loading={props.submitLoading}
            >
              {t('common.submit')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default ProgressConfig;
