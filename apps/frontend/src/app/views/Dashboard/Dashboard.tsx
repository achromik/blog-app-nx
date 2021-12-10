import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout/MainLayout';
import { Me } from './views';
import { Users } from './views/Users/Users';

export const Dashboard: React.FC = () => (
  <MainLayout title="The dashboard">
    <Routes>
      <Route path="/" element={<h1>The Dashboard</h1>} />
      <Route path="users" element={<Users />} />
      <Route path="me" element={<Me />} />
    </Routes>
  </MainLayout>
);
