import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { AppRoutes } from '../../config';
import { Me } from './views';
import { Users } from './views/Users/Users';

export const Dashboard: React.FC = () => (
  <DashboardLayout title="The dashboard">
    <Routes>
      <Route path="/" element={<h1>The Dashboard</h1>} />
      <Route path={AppRoutes.dashboardRoute.users} element={<Users />} />
      <Route path={AppRoutes.dashboardRoute.me} element={<Me />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  </DashboardLayout>
);
