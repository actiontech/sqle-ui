import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../store/locale';

const Home = () => {
  const dispatch = useDispatch();

  return (
    <div>
      home page
      <Button
        onClick={() => {
          dispatch(
            updateLanguage({
              language: 'zh-en',
            })
          );
        }}
      >
        123
      </Button>
    </div>
  );
};

export default Home;
