import React from 'react';

import { Provider } from 'react-redux';

import store from './store';

import AppRouter from './routers/AppRouter';
import ConfirmModal from './components/ConfirmModal';

const App: React.FC = () => {
  return (
    <>
      <Provider store={store}>
        <AppRouter />
        <ConfirmModal />
      </Provider>
    </>
  );
};

export default App;
