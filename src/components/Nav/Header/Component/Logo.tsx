import { useSelector } from 'react-redux';
import logo from '../../../../assets/img/logo.png';
import { IReduxState } from '../../../../store';
import { Link } from '../../../Link';

const Logo: React.FC = () => {
  const { webLogoUrl, webTitle } = useSelector((state: IReduxState) => ({
    webTitle: state.system.webTitle,
    webLogoUrl: state.system.webLogoUrl,
  }));
  return (
    <Link to="home">
      <div className="sqle-nav-title">
        <img src={webLogoUrl ? webLogoUrl : logo} alt="" />
        {webTitle}
      </div>
    </Link>
  );
};

export default Logo;
