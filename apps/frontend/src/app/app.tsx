import { AppVersion } from './components/AppVersion/AppVersion';
import { CustomRouter } from './router/CustomRouter';
import { history } from './router/history';

import { Router as AppRouter } from './router/Router';

const App: React.FC = () => (
  <>
    <CustomRouter history={history}>
      <AppRouter />
    </CustomRouter>
    <AppVersion />
  </>
);

export default App;
