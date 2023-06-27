import { Card, Space } from 'antd';
import React from 'react';
import './index.less';
import { FooterButtonWrapperProps } from '.';

const FooterButtonWrapper: React.FC<FooterButtonWrapperProps> = ({
  children,
  insideProject = true,
}) => {
  return (
    <section
      className={`footer-button-wrapper ${
        insideProject ? 'inside-the-project-footer-button-wrapper' : ''
      }`}
    >
      <Card
        bodyStyle={{
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Space className="full-width-element flex-end-horizontal">
          {children}
        </Space>
      </Card>
    </section>
  );
};

export default FooterButtonWrapper;
