import { Card, Space, Typography } from 'antd';
import { EnterpriseFeatureDisplayProps } from '.';
import { useTranslation } from 'react-i18next';

const EnterpriseFeatureDisplay: React.FC<EnterpriseFeatureDisplayProps> = ({
  children,
  eeFeatureDescription,
  featureName,
  clearCEWrapperPadding = false,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* IFTRUE_isCE */}
      <section className={clearCEWrapperPadding ? '' : 'padding-content'}>
        <Card bordered={false}>
          <Space direction="vertical" size={26}>
            <article>
              <Typography.Title level={4}>
                {t('common.enterpriseFeatureDisplay.featureDescription')}
              </Typography.Title>

              <Typography.Text className="whitespace-pre-line">
                {eeFeatureDescription}
              </Typography.Text>
            </article>

            <article>
              <Space direction="vertical">
                <Typography.Title level={4}>
                  {t('common.enterpriseFeatureDisplay.additionalAttention')}
                </Typography.Title>

                <>
                  <Typography.Text>
                    {t('common.enterpriseFeatureDisplay.businessLink', {
                      featureName,
                    })}
                  </Typography.Text>
                  <ul>
                    <li>
                      <a href="https://actiontech.github.io/sqle-docs/docs/support/commercial-support">
                        https://actiontech.github.io/sqle-docs/docs/support/commercial-support
                      </a>
                    </li>
                    <li>
                      <a href="https://www.actionsky.com/">
                        https://www.actionsky.com/
                      </a>
                    </li>
                  </ul>
                </>

                <>
                  <Typography.Text>
                    {t('common.enterpriseFeatureDisplay.compareLink')}
                  </Typography.Text>
                  <ul>
                    <li>
                      <a href="https://actiontech.github.io/sqle-docs/docs/support/compare">
                        https://actiontech.github.io/sqle-docs/docs/support/compare
                      </a>
                    </li>
                  </ul>
                </>
              </Space>
            </article>
          </Space>
        </Card>
      </section>

      {/* FITRUE_isCE */}

      {/* IFTRUE_isEE */}
      {children}
      {/* FITRUE_isEE */}
    </>
  );
};

export default EnterpriseFeatureDisplay;
