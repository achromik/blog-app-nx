import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout/MainLayout';
import { ROUTES } from '../../config';
import { Me } from './views';
import { Users } from './views/Users/Users';

export const Dashboard: React.FC = () => (
  <MainLayout title="The dashboard">
    <Routes>
      <Route path="/" element={<h1>The Dashboard</h1>} />
      <Route path={ROUTES.dashboardRoute.users} element={<Users />} />
      <Route path={ROUTES.dashboardRoute.me} element={<Me />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  </MainLayout>
);
