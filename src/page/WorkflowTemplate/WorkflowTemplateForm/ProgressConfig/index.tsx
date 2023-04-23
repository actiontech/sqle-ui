import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/styles';
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
  Radio,
  StepProps,
} from 'antd';
import { cloneDeep } from 'lodash';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkFlowStepTemplateReqV1 } from '../../../../api/common';
import { WorkFlowStepTemplateReqV1TypeEnum } from '../../../../api/common.enum';
import EmptyBox from '../../../../components/EmptyBox';
import EmitterKey from '../../../../data/EmitterKey';
import useUsername from '../../../../hooks/useUsername';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  ExecProgressConfigItem,
  ProgressConfigItem,
  ProgressConfigProps,
} from './index.type';
import { Theme } from '@mui/material/styles';

export enum ProgressConfigReviewTypeEnum {
  specify = 'specify',
  matchAudit = 'matchAudit',
}

export enum ProgressConfigExecuteTypeEnum {
  specify = 'specify',
  matchExecute = 'matchExecute',
}

const ProgressConfig: React.FC<ProgressConfigProps> = (props) => {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const [progressData, setProgressData] = useState<ProgressConfigItem[]>([]);
  const [execProgressData, setExecProgressData] =
    useState<ExecProgressConfigItem>({
      execute_by_authorized: false,
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

  const updateReviewType = (
    index: number,
    value: ProgressConfigReviewTypeEnum
  ) => {
    const temp = cloneDeep(progressData);
    temp[index].approved_by_authorized =
      value === ProgressConfigReviewTypeEnum.matchAudit;
    if (value === ProgressConfigReviewTypeEnum.matchAudit) {
      temp[index].assignee_user_name_list = [];
    }
    if (progressError.includes(index) && temp[index].approved_by_authorized) {
      setProgressError(progressError.filter((e) => e !== index));
    }
    setProgressData(temp);
  };

  const updateExecuteType = (value: ProgressConfigExecuteTypeEnum) => {
    const temp = cloneDeep(execProgressData);
    temp.execute_by_authorized =
      value === ProgressConfigExecuteTypeEnum.matchExecute;

    if (value === ProgressConfigExecuteTypeEnum.matchExecute) {
      temp.assignee_user_name_list = [];
    }
    if (execProgressError) {
      setExecProgressErrorFalse();
    }
    setExecProgressData(temp);
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
      approved_by_authorized: false,
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
      if (!progressData[i].approved_by_authorized && (len <= 0 || len > 3)) {
        tempError.push(i);
      }
    }
    setProgressError(tempError);
    const allowSubmitReview = tempError.length === 0;

    const executeUserLength = execProgressData.assignee_user_name_list.length;

    const allowSubmitExecute =
      execProgressData.execute_by_authorized ||
      (executeUserLength > 0 && executeUserLength <= 3);

    if (!allowSubmitExecute) {
      setExecProgressErrorTrue();
    } else {
      setExecProgressErrorFalse();
    }

    return allowSubmitReview && allowSubmitExecute;
  };

  const resetProgress = React.useCallback(() => {
    setProgressData([]);
    setExecProgressData({
      execute_by_authorized: false,
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
    updateUsernameList(props.projectName);
  }, [props.projectName, updateUsernameList]);

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
          execute_by_authorized: !!templateList?.[0].execute_by_authorized,
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
          approved_by_authorized: !!e.approved_by_authorized,
        })) ?? []
      );
      setExecProgressData({
        execute_by_authorized: !!execStep?.execute_by_authorized,
        assignee_user_name_list: execStep?.assignee_user_name_list ?? [],
        desc: execStep?.desc ?? '',
      });
    }
  }, [props.defaultData]);

  return (
    <Space direction="vertical" className="full-width-element" size={24}>
      <Row>
        <Col span={10} offset={3}>
          <Steps
            direction="vertical"
            items={[
              {
                status: 'process',
                title: t('workflowTemplate.progressConfig.createStep.title'),
                description: t(
                  'workflowTemplate.progressConfig.createStep.desc'
                ),
              },
              ...progressData.map((progressItem, index) => ({
                key: index,
                status: (progressError.includes(index)
                  ? 'error'
                  : 'process') as StepProps['status'],
                title: t('workflowTemplate.progressConfig.review.title'),
                subTitle: t('workflowTemplate.progressConfig.review.subTitle'),
                description: (
                  <Row>
                    <Col span={18}>
                      <Space
                        size={theme.common.padding}
                        direction="vertical"
                        className="full-width-element"
                      >
                        <Row>
                          <Col span={5} className="text-black">
                            {t('workflowTemplate.form.label.reviewUserType')}
                          </Col>
                          <Col span={18}>
                            <Radio.Group
                              value={
                                progressItem.approved_by_authorized
                                  ? ProgressConfigReviewTypeEnum.matchAudit
                                  : ProgressConfigReviewTypeEnum.specify
                              }
                              onChange={(e) =>
                                updateReviewType(index, e.target.value)
                              }
                            >
                              <Radio
                                value={ProgressConfigReviewTypeEnum.specify}
                              >
                                {t(
                                  'workflowTemplate.progressConfig.review.reviewUserType.specifyAudit'
                                )}
                              </Radio>
                              <Radio
                                value={ProgressConfigReviewTypeEnum.matchAudit}
                              >
                                {t(
                                  'workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
                                )}
                              </Radio>
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={5}>
                            {t('workflowTemplate.form.label.reviewUser')}
                          </Col>
                          <Col span={18}>
                            <Select
                              disabled={progressItem.approved_by_authorized}
                              value={progressItem.assignee_user_name_list}
                              onChange={updateUsername.bind(null, index)}
                              className="full-width-element"
                              mode="multiple"
                              showSearch
                              placeholder={t('common.form.placeholder.select')}
                              data-testid={`review-user-${index}`}
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
                              data-testid={`review-desc-${index}`}
                            />
                          </Col>
                        </Row>
                        <EmptyBox if={progressError.includes(index)}>
                          <Alert
                            type="error"
                            message={t(
                              'workflowTemplate.progressConfig.ruler.rule3'
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
                          data-testid="move-up"
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
                          data-testid="move-down"
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
                ),
              })),
              {
                title: t('workflowTemplate.progressConfig.exec.title'),
                status: (execProgressError
                  ? 'error'
                  : 'process') as StepProps['status'],
                subTitle: t('workflowTemplate.progressConfig.exec.subTitle'),
                description: (
                  <Row>
                    <Col span={18}>
                      <Space
                        size={theme.common.padding}
                        direction="vertical"
                        className="full-width-element"
                      >
                        <Row>
                          <Col span={5} className="text-black">
                            {t('workflowTemplate.form.label.execUserType')}
                          </Col>
                          <Col span={18}>
                            <Radio.Group
                              onChange={(e) =>
                                updateExecuteType(e.target.value)
                              }
                              value={
                                execProgressData.execute_by_authorized
                                  ? ProgressConfigExecuteTypeEnum.matchExecute
                                  : ProgressConfigExecuteTypeEnum.specify
                              }
                            >
                              <Radio
                                value={ProgressConfigExecuteTypeEnum.specify}
                              >
                                {t(
                                  'workflowTemplate.progressConfig.exec.executeUserType.specifyExecute'
                                )}
                              </Radio>
                              <Radio
                                value={
                                  ProgressConfigExecuteTypeEnum.matchExecute
                                }
                              >
                                {t(
                                  'workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
                                )}
                              </Radio>
                            </Radio.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={5}>
                            {t('workflowTemplate.form.label.execUser')}
                          </Col>
                          <Col span={18}>
                            <Select
                              disabled={execProgressData.execute_by_authorized}
                              onChange={updateExecUsername}
                              value={execProgressData.assignee_user_name_list}
                              className="full-width-element"
                              mode="multiple"
                              showSearch
                              placeholder={t('common.form.placeholder.select')}
                              data-testid="exec-user-select"
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
                              data-testid="exec-user-desc"
                            />
                          </Col>
                        </Row>
                        <EmptyBox if={execProgressError}>
                          <Alert
                            type="error"
                            message={t(
                              'workflowTemplate.progressConfig.ruler.rule3'
                            )}
                          />
                        </EmptyBox>
                      </Space>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
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
        <Col offset={13}>
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
