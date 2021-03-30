import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      home page
      <Link to="/workflow">workflow</Link>
      <Button>123</Button>
    </div>
  );
};

export default Home;
