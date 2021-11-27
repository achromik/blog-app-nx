import { BrowserRouter } from 'react-router-dom';
import { CustomRouter } from './router/CustomRouter';
import { history } from './router/history';

import { Router as AppRouter } from './router/Router';

const App: React.FC = () => (
  // <BrowserRouter navigator={history} location={history.location}>
  <CustomRouter history={history}>
    <AppRouter />
  </CustomRouter>
);

export default App;
