import React from 'react';
import Nprogress from 'nprogress';
Nprogress.configure({
  showSpinner: false,
});

const HeaderProgress = () => {
  React.useEffect(() => {
    Nprogress.start();
    return () => {
      Nprogress.done();
    };
  }, []);

  return null;
};

export default HeaderProgress;
