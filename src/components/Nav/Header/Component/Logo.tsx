import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/img/logo.png';
import { IReduxState } from '../../../../store';

const Logo: React.FC = () => {
  const { t } = useTranslation();
  const { webLogoUrl, webTitle } = useSelector((state: IReduxState) => ({
    webTitle: state.system.webTitle,
    webLogoUrl: state.system.webLogoUrl,
  }));
  return (
    <Link to="/">
      <div className="sqle-nav-title">
        <img src={webLogoUrl ? webLogoUrl : logo} alt="" />
        {webTitle} {/* IFTRUE_isEE */}
        {t('common.nav.eeTitle')}
        {/* FITRUE_isEE */}
      </div>
    </Link>
  );
};

export default Logo;
