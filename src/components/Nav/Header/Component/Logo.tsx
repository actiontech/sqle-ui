import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/img/logo.png';

const Logo: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Link to="/dashboard">
      <div className="sqle-nav-title">
        <img src={logo} alt="" />
        {/* IFTRUE_isCE */}
        {t('common.nav.title')}
        {/* FITRUE_isCE */}
        {/* IFTRUE_isEE */}
        {t('common.nav.eeTitle')}
        {/* FITRUE_isEE */}
      </div>
    </Link>
  );
};

export default Logo;
