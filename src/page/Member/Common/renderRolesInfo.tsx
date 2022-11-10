import { Space, Typography } from 'antd';
import { IBindRoleReqV1 } from '../../../api/common';

const renderRolesInfo = (roles: IBindRoleReqV1[], ellipsis: boolean) => {
  const genContent = (roleNames?: string[], instanceName?: string) =>
    `${instanceName ?? ''}: [ ${roleNames?.toString() ?? ''} ]`;
  return (
    <Space direction="vertical">
      {roles.map((v) => {
        return ellipsis ? (
          <Typography.Text ellipsis={ellipsis} key={v.instance_name}>
            {genContent(v.role_names, v.instance_name)}
          </Typography.Text>
        ) : (
          <div key={v.instance_name}>
            {genContent(v.role_names, v.instance_name)}
          </div>
        );
      })}
    </Space>
  );
};

export default renderRolesInfo;
