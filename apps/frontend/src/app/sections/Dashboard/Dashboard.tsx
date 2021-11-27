import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout/MainLayout';
import { Me } from './views';

export const Dashboard: React.FC = () => (
  <MainLayout title="dashbaord">
    <Routes>
      <Route path="test" element={<h1>TEST</h1>} />
      <Route path="me" element={<Me />} />
    </Routes>
  </MainLayout>
);
