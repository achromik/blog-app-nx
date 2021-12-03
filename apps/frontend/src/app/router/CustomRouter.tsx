import { useLayoutEffect, useState } from 'react';

import { Router } from 'react-router-dom';
import { BrowserHistory } from 'history';

interface Props {
  history: BrowserHistory;
  children: JSX.Element;
}

export const CustomRouter = ({ history, children, ...props }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
};
