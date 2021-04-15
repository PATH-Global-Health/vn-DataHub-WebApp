import { ReactNode } from 'react';

import PageNotFound from '@app/pages/PageNotFound';
import LoginPage from '@app/pages/LoginPage';
import AuthPage from '@app/pages/AuthPage';
import HomePage from '@app/pages/HomePage';
import AppLayout from '@app/components/app-layout';

interface Route {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  path?: string;
  exact?: boolean;
  isPrivate?: boolean;
}

const routes: Route[] = [
  {
    component: AuthPage,
    path: '/',
    exact: true,
  },
  {
    component: AuthPage,
    path: '/auth',
  },
  {
    component: LoginPage,
    path: '/login',
  },
  {
    component: HomePage,
    path: '/home',
    layout: AppLayout,
    isPrivate: true,
  },
  {
    component: PageNotFound,
  },
];

export default routes;
