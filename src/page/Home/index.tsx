import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      home page
      <Link to="/workflow">workflow</Link>
      <Link to="/order/1">workflow 1</Link>
      <Link to="/order/2">workflow 2</Link>
      <Button>123</Button>
    </div>
  );
};

export default Home;
