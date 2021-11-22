import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import styles from './app.module.scss';

import { MainLayout } from './components/MainLayout/MainLayout';
import { Router } from './router/Router';
// import { AuthRoute } from './router/AuthRoute';
// import { Login } from './views/Login/Login';

const App: React.FC = () => (
  <BrowserRouter>
    <Router />
    {/* <AuthRoute>
        <Routes>
          <Route path="test" element={<div>test</div>} />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthRoute> */}
  </BrowserRouter>
);

export default App;
