import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';

import App from './app/app';
import { store } from '../src/app/store/store';
// import { setupInterceptors } from './app/services/http';
import { history } from './app/router/history';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

// const { dispatch } = store;
// setupInterceptors(dispatch, history);
